import React from 'react';

const escapeRegex = (text) => `(${text?.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')})`;

const getIndices = ({ i, regexText, group, indices, index }) => {
  let start;
  let end;

  if (indices === null) {
    start = regexText.indexOf(group) + index;
    end = start + group.length;
  } else {
    // eslint-disable-next-line prefer-destructuring
    start = indices[i + 1][0];
    // eslint-disable-next-line prefer-destructuring
    end = indices[i + 1][1];
  }

  return { start, end };
};

// Wraps text in a <p> and inserts spans around selected phrases
// Highlights is a list of { regex, className } pairs - each 'regex' must have a capture group
// Returns JSX
export function insertSpans(text, highlights, options = { p: true }) {
  // 1. Locate matches within the text
  const matches = highlights.reduce((arr, highlight) => {
    if (!(highlight.text || highlight.regex))
      throw new Error('insertSpan(): Each span must have either highlight.text or highlight.regex');

    const regexStr = highlight.regex || escapeRegex(highlight.text);
    let regex;
    try {
      regex = new RegExp(regexStr, 'gd');
    } catch {
      // error handling in case of old safari, which doesn't accept `d` flag for regex
      regex = new RegExp(regexStr, 'g');
    }

    let match;
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(text))) {
      const regexText = match[0];

      // Add all capture groups (but not the whole string) to the list
      const { indices = null, index } = match;

      arr.push(
        ...match.slice(1).map((group, i) => {
          const { start, end } = getIndices({ i, regexText, group, indices, index });

          return {
            ...highlight,
            match: group,
            start,
            end,
          };
        })
      );
    }
    return arr;
  }, []);

  if (matches.length === 0) return options.p ? <p>{text}</p> : text;

  // 2. Compile a set of HTML tags for the matches, sorted by insertion index
  const tags = matches
    .map((match) => {
      const el = match.element || 'span';
      const props = Object.entries(match.props || { class: match.className })
        .map(([k, v]) => (k && v ? `${k}="${v?.replace('"', '\\"')}"` : ''))
        .join(' ');

      // Add the start/end tags to the queue
      const matchTags = [
        { tag: `<${el} ${props}>`, index: match.start },
        { tag: `</${el}>`, index: match.end },
      ];

      // Add a special "replace" tag if necessary
      if (match.innerText)
        matchTags.push({
          tag: match.innerText,
          index: match.start,
          replace: match.end - match.start,
        });

      return matchTags;
    })
    .flat()
    .sort((a, b) => a.index - b.index);

  // 3. Insert the HTML tags into the string
  const output = tags.reduce(
    ({ offset, __html }, { tag, index, replace = 0 }) => ({
      offset: offset + tag.length - replace,
      __html: __html.slice(0, index + offset) + tag + __html.slice(index + offset + replace),
    }),
    { offset: 0, __html: text }
  );

  return options.p ? <p dangerouslySetInnerHTML={output} /> : output;
}

export default null;
