/**
 * @file getArchieDoc
 * Loads text from a Google Doc and saves it as ArchieML.
 *
 */

import 'dotenv/config';
import { google } from 'googleapis';
import archieml from 'archieml';

// ArchieML types to be grouped together as text
const TEXT_TYPES = ['text', 'subhed', 'video', 'image'];

async function getDocsText(docId) {
  const auth = await google.auth.getClient({
    projectId: process.env.G_PROJECT_ID,
    credentials: {
      type: 'service_account',
      private_key: process.env.G_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.G_CLIENT_EMAIL,
      client_id: process.env.G_CLIENT_ID,
      token_url: 'https://oauth2.googleapis.com/token',
      universe_domain: 'googleapis.com',
    },
    scopes: ['https://www.googleapis.com/auth/documents'],
  });

  const docsApi = google.docs({ version: 'v1', auth });

  const { data } = await docsApi.documents.get({
    documentId: docId,
  });

  return data.body.content.reduce(
    ({ text, links }, content) => {
      const paras = content.paragraph?.elements ?? [];
      const paraText = paras
        .map((p) => {
          const str = p.textRun?.content;
          const url = p.textRun?.textStyle?.link?.url;
          if (str && url) {
            links.push({ str, url });
          }
          return str ?? '';
        })
        .join('');
      return {
        text: text + paraText,
        links,
      };
    },
    { text: '', links: [] }
  );
}

/*
 * This is some custom logic to parse scroll cards into a nested structure.
 * You may not need it in every project.
 */
function parseScrolly(items) {
  const queue = [...items];

  const steps = [];
  const figures = [];
  while (queue.length > 0) {
    if (queue[0]?.type === 'scroll') {
      // Insert a new figure if the keyword (i.e. first word) of the 'scroll' key doesn't match
      const key = queue.shift().value.split(' ')[0]?.toLowerCase();

      // Gobble up any non-text keys as config for scroll
      const config = {};
      while (queue[0]?.type && queue[0].type !== 'text') {
        const { type, value } = queue.shift();
        config[type] = value;
      }

      if (figures[figures.length - 1]?.key !== key) {
        figures.push({
          key,
          config,
          steps: [],
        });
      }
    } else if (figures.length === 0) {
      // In case the ArchieML doc starts with a "text" card, create a dummy figure
      figures.push({
        key: 'intro',
        config: {},
        steps: [],
      });
    }

    const cards = [];
    while (queue[0]?.type === 'text') {
      // Add each paragraph as a text card inside the step
      cards.push({
        text: queue.shift().value,
      });
    }
    if (figures[figures.length - 1].key === 'headline' && cards.length === 0) {
      cards.push({
        headline: true,
      });
    }

    // Add this step number to the figure's list
    figures[figures.length - 1].steps.push(steps.length);

    // Add the step, with the list of cards, to our list
    steps.push({
      step: steps.length,
      figure: figures[figures.length - 1].key,
      config: figures[figures.length - 1].config,
      cards,
    });
  }

  // Return a separated list of steps and figures
  return {
    steps,
    figures,
  };
}

/**
 * This method extends ArchieML syntax for our projects. It currently
 * does a few things:
 * - Structures scrolly sections (either via [+topper] or [+.scrolly])
 * - Groups together non-text keys
 * - Adds links to body text
 */
function parseCustomSyntax(archieJson, doclinks = []) {
  const json = {
    ...archieJson,
    updatedAt: new Date().toISOString(),
  };

  // Format the topper into groups of steps divided by 'scroll' keys
  if (json.topper) {
    json.topper = parseScrolly(json.topper);
  }

  // Group together non-text keys in the body for visual components
  // (This is some custom logic for this project, you may not need it in others.)
  if (json.body) {
    const queue = [...json.body];
    const components = [];

    while (queue.length > 0) {
      // Gather up all non-text elements into one component with key/value pairs
      const obj = {};
      while (!TEXT_TYPES.includes(queue[0]?.type)) {
        const { type, value } = queue.shift();
        // If component type isn't explicitly set, it defaults to the first key (e.g. 'image')
        if (type !== 'type' && !obj.type) {
          obj.type = type;
        }
        obj[type] = value;
      }
      if (obj.type === 'scrolly') {
        components.push({
          type: obj.type,
          ...parseScrolly(obj.scrolly),
        });
      } else if (obj.type) {
        components.push(obj);
      }

      // Group adjacent text components into a list of paragraphs
      const text = { type: 'text', paras: [] };
      while (TEXT_TYPES.includes(queue[0]?.type)) {
        const { type, value } = queue.shift();
        const element = { type, value };

        if (type === 'text') {
          // Check if any of the link strings are in this paragraph and store them
          const links = doclinks.filter(({ str }) => value.includes(str));
          if (links.length > 0) element.links = links;
        }

        if (queue[0]?.type === 'caption') {
          element.caption = queue.shift().value;
        }
        text.paras.push(element);
      }
      if (text.paras.length > 0) components.push(text);
    }

    json.body = components;
  }

  return json;
}

/**
 * @function getArchieDoc
 * This function will load text from a Google Doc and parse it as ArchieML.
 * To use it, first make sure environment variables in `.env.example` are filled out,
 * and the Google Service Account has been shared in on your document.
 *
 * Then, you should call this function inside `config/data.js` and run `npm run data` to fetch
 * latest content of the document and cache it in `config/data.json`. (Note: it is usually
 * preferrable to cache ArchieML data in this file, rather than load it at build time.)
 *
 * @param {string} id A google doc ID (last component of the URL). (default: process.env.G_DOC_ID)
 * @param {boolean} customSyntax Whether to use our custom extended syntax. (default: true)
 * @returns The contents of the Google Doc, formatted as json components
 */
export default async function getArchieDoc(id = process.env.G_DOC_ID, customSyntax = true) {
  if (!id) {
    throw new Error("You must provide an 'id' or set G_DOC_ID in the environment to load ArchieML");
  }

  const { text, links } = await getDocsText(id);

  let json = archieml.load(text);
  if (customSyntax) {
    json = parseCustomSyntax(json, links);
  }

  return json;
}
