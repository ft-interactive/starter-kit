/**
 * @file getArchieDoc
 * Loads text from a Google Doc and saves it as ArchieML.
 *
 */

import 'dotenv/config';
import { google } from 'googleapis';
import archieml from 'archieml';

// ArchieML types to be grouped together as text
const TEXT_TYPES = ['text', 'subhed', 'promo'];
const INLINE_TYPES = [
  'inline-video',
  'inline-image',
  'inline-image-pair',
  'inline-graphic',
  'promo',
];

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
    ({ text, spans, ignored }, content) => {
      const paras = content.paragraph?.elements ?? [];
      const paraText = paras.reduce((acc, p) => {
        // If the text is struck through, skip it
        if (p.textRun?.textStyle?.strikethrough) {
          return acc;
        }

        const str = p.textRun?.content?.replace('\n', '');
        const url = p.textRun?.textStyle?.link?.url;
        if (str && url && !ignored) {
          spans.push({
            text: str,
            element: 'a',
            props: { href: url, target: url.includes('ft.com/') ? undefined : '_blank' },
            context: acc.match(/^(?:[\w_-]+: )?(.*)/)[1], // strip out archieml tags paragraph from context
          });
        }

        if (str && p.textRun?.textStyle.italic && !ignored) {
          spans.push({ text: str, element: 'i', context: acc });
        }
        if (str && p.textRun?.textStyle.bold && !ignored) {
          spans.push({ text: str, element: 'b', context: acc });
        }

        return acc + (str ?? '');
      }, '');

      // Combine adjacent spans with same urls
      if (!ignored) {
        /* eslint-disable no-param-reassign */
        spans = spans.reduce((arr, span) => {
          const prev = arr[arr.length - 1];
          if (
            span.element === prev?.element &&
            span.props?.href === prev?.props?.href &&
            span.context.endsWith(prev?.text)
          ) {
            arr[arr.length - 1].text += span.text;
          } else {
            arr.push(span);
          }
          return arr;
        }, []);
        /* eslint-enable no-param-reassign */
      }

      return {
        text: text + paraText + (paraText.endsWith('\n') ? '' : '\n'),
        spans,
        ignored: ignored || paraText.includes(':ignore'),
      };
    },
    { text: '', spans: [], ignored: false }
  );
}

/**
 * @function parseScrolly
 * This is some custom logic to parse scroll cards into a nested structure.
 * You may not need it in every project.
 * (To use it, call it from "parseCustomSyntax".)
 */
// eslint-disable-next-line no-unused-vars
function parseScrolly(items, spans) {
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
 * @function parseBody
 * This method is used to structure ArchieML body text into our custom structure. It:
 * - Groups together non-text keys
 * - Compiles type: "text" list of paragraphs
 * - Adds decorators (<a>, <b>, <i>) to body text
 * @param {array} body An array of ArchieML elements
 * @param {array} spans A list of span inserts
 * @returns
 */
function parseBody(body, spans) {
  let subhedId = 0;
  const queue = [...body];
  const components = [];

  while (queue.length > 0) {
    // Gather up all non-text elements into one component with key/value pairs
    const obj = {};
    while (queue.length > 0 && !TEXT_TYPES.includes(queue[0]?.type)) {
      const { type, value } = queue.shift();
      // If component type isn't explicitly set, it defaults to the first key (e.g. 'image')
      if (type !== 'type' && !obj.type) {
        obj.type = type;
      }
      obj[type] = value;
    }

    if (obj.type?.startsWith('scrolly')) {
      components.push({
        ...parseScrolly(obj[obj.type]),
        ...obj,
      });
    } else if (obj.type) {
      components.push(obj);
    }

    // Group adjacent text components into a list of paragraphs
    const text = { type: 'text', paras: [] };
    while (queue[0] && [...TEXT_TYPES, ...INLINE_TYPES].includes(queue[0]?.type)) {
      const { type, value } = queue.shift();
      const element = { type, value };

      // If it's an inline type, gobble up non-text types
      if (INLINE_TYPES.includes(type)) {
        while (queue[0] && !TEXT_TYPES.includes(queue[0]?.type)) {
          const { type: k, value: v } = queue.shift();
          element[k] = v;
        }
      }

      if (TEXT_TYPES.includes(type)) {
        // matches 'text', 'subhead', etc
        // Check if any of the link strings are in this paragraph and store them
        const pSpans = spans
          .filter(({ text: t, context: c }) => value.includes(c) && value.includes(t))
          .map(({ context, ...d }) => d);
        if (pSpans.length > 0) element.spans = pSpans;
      }

      if (type === 'subhed') {
        element.id = subhedId;
        subhedId += 1;
      }

      text.paras.push(element);
    }
    if (text.paras.length > 0) components.push(text);
  }

  return components;
}

/**
 * @function parseCustomSyntax
 * This method extends ArchieML syntax for our projects.
 * Based on specific keys, it either calls
 * - "parseBody" (to group together text keys and embeds)
 * - "parseScrolly" (to group together scroll steps and background figures)
 *
 * NOTE: This is likely where you'll do custom transformations for your project
 */
function parseCustomSyntax({ json, spans = [] }) {
  // eslint-disable-next-line no-param-reassign
  json.updatedAt = new Date().toISOString();

  if (json.topper) {
    /* NOTE:
       If your topper is more like paragraphs than a scrolly,
       switch the line below call "parseBody()"
    */

    // eslint-disable-next-line no-param-reassign
    json.topper = parseScrolly(json.topper, spans);
  }

  if (json.body) {
    // eslint-disable-next-line no-param-reassign
    json.body = parseBody(json.body, spans);
  }

  if (json.notes) {
    // eslint-disable-next-line no-param-reassign
    json.notes = parseBody(json.notes, spans);
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

  const { text, spans } = await getDocsText(id);

  let json = archieml.load(text);
  if (customSyntax) {
    json = parseCustomSyntax({ json, spans });
  }

  return json;
}
