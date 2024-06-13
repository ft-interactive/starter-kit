/**
 * @file getArchieDoc
 * Loads text from a Google Doc and saves it as ArchieML.
 *
 */

import 'dotenv/config';
import { google } from 'googleapis';
import archieml from 'archieml';

// ArchieML types to be grouped together as text
const TEXT_TYPES = ['text', 'subhed'];
const INLINE_TYPES = ['inline-video', 'inline-image', 'inline-image-pair', 'inline-graphic'];

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
    ({ text, links, ignored }, content) => {
      const paras = content.paragraph?.elements ?? [];
      const paraText = paras
        .map((p) => {
          // If the text is struck through, skip it
          if (p.textRun?.textStyle?.strikethrough) return '';

          const str = p.textRun?.content;
          const url = p.textRun?.textStyle?.link?.url;
          if (str && url && !ignored) {
            links.push({ str, url });
          }

          return str ?? '';
        })
        .join('');

      // Combine adjacent links with same urls
      if (!ignored) {
        /* eslint-disable no-param-reassign */
        links = links.reduce((arr, link) => {
          if (link.url === arr[arr.length - 1]?.url) {
            arr[arr.length - 1].str += link.str;
          } else {
            arr.push(link);
          }

          return arr;
        }, []);
        /* eslint-enable no-param-reassign */
      }

      return {
        text: text + paraText,
        links,
        ignored: ignored || paraText.includes(':ignore'),
      };
    },
    { text: '', links: [], ignored: false }
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
    let figure;
    let step;
    const config = {};

    // This while loop lets us manage either order, figure -> step or step -> figure
    while (queue.length > 0 && (figure === undefined || step === undefined)) {
      if (figure === undefined && ['scroll', 'figure'].includes(queue[0]?.type)) {
        // Insert a new figure if the keyword (i.e. first word) of the 'scroll' key doesn't match
        const key = queue.shift().value.split(' ')[0]?.toLowerCase();

        // Gobble up any non-text keys as config for scroll
        while (queue[0]?.type && queue[0].type !== 'text') {
          const { type, value } = queue.shift();
          config[type] = value;
        }

        if (figures[figures.length - 1]?.key === key) {
          figure = figures[figures.length - 1];
        } else {
          figure = { key, config, steps: [] };
        }
      }

      if (step === undefined) {
        const cards = [];

        while ([...INLINE_TYPES, ...TEXT_TYPES].includes(queue[0]?.type)) {
          const { type, value } = queue.shift();
          const component = {
            [type]: value,
          };

          // Gather up any other object config keys
          while (
            queue[0]?.type &&
            !['scroll', ...INLINE_TYPES, ...TEXT_TYPES].includes(queue[0].type)
          ) {
            const { type: k, value: v } = queue.shift();
            component[k] = v;
          }

          cards.push(component);
        }

        if (figure?.key === 'headline' && cards.length === 0) {
          cards.push({ headline: true });
        }

        step = {
          step: steps.length,
          cards,
          config,
        };
      }
    }

    // console.log('Found pair', { figure, step });

    // Link together figure and step
    step.figure = figure.key;
    figure.steps.push(step.step);

    // Persist both to their arrays
    steps.push(step);
    if (figures[figures.length - 1]?.key === figure.key) {
      figures[figures.length - 1] = figure;
    } else {
      figures.push(figure);
    }

    // Repeat while loop if objects continue
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
    let subhedId = 0;
    const queue = [...json.body];
    const components = [];

    while (queue.length > 0) {
      // Gather up all non-text elements into one component with key/value pairs
      const obj = {};
      let typeValue;
      while (queue.length > 0 && !TEXT_TYPES.includes(queue[0]?.type)) {
        const { type, value } = queue.shift();
        // If component type isn't explicitly set, it defaults to the first key (e.g. 'image')
        if (type !== 'type' && !obj.type) {
          obj.type = type;
          typeValue = value;
        }
        obj[type] = value;
      }
      if (obj.type?.startsWith('scrolly')) {
        components.push({
          type: obj.type,
          ...parseScrolly(obj[obj.type]),
          ...obj,
          [obj.type]: typeValue,
        });
      } else if (obj.type) {
        components.push(obj);
      }

      // Group adjacent text components into a list of paragraphs
      const text = { type: 'text', paras: [] };
      while ([...TEXT_TYPES, ...INLINE_TYPES].includes(queue[0]?.type)) {
        const { type, value } = queue.shift();
        const element = { type, value };

        // If it's an inline type, gobble up non-text types
        if (INLINE_TYPES.includes(type)) {
          while (!TEXT_TYPES.includes(queue[0].type)) {
            const { type: k, value: v } = queue.shift();
            element[k] = v;
          }
        }

        if (type === 'text') {
          // Check if any of the link strings are in this paragraph and store them
          const links = doclinks.filter(({ str }) => value.includes(str));
          if (links.length > 0) element.links = links;
        }

        if (type === 'subhed') {
          element.id = subhedId;
          subhedId += 1;
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

  if (json.notes) {
    const queue = [...json.notes];
    const components = [];

    while (queue.length > 0) {
      // This is copied from the if(json.body) section above
      // (hacky, but quick)

      const obj = {};
      while (queue.length > 0 && !TEXT_TYPES.includes(queue[0]?.type)) {
        const { type, value } = queue.shift();
        // If component type isn't explicitly set, it defaults to the first key (e.g. 'image')
        if (type !== 'type' && !obj.type) {
          obj.type = type;
        }
        obj[type] = value;
      }

      if (obj.type) components.push(obj);

      const text = { type: 'text', paras: [] };
      while (TEXT_TYPES.includes(queue[0]?.type)) {
        const { type, value } = queue.shift();
        const element = { type, value };

        if (type === 'text') {
          // Check if any of the link strings are in this paragraph and store them
          const links = doclinks.filter(({ str }) => value.includes(str));
          if (links.length > 0) element.links = links;
        }

        text.paras.push(element);
      }

      if (text.paras.length > 0) components.push(text);
    }

    json.notes = components;
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

  if (process.env.G_DOC_ID && id !== process.env.G_DOC_ID) {
    throw new Error(
      "You have provided an 'id' that is different from the G_DOC_ID environment variable"
    );
  }

  const { text, links } = await getDocsText(id);

  let json = archieml.load(text);
  if (customSyntax) {
    json = parseCustomSyntax(json, links);
  }

  return json;
}
