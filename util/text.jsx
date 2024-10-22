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

const findOverlappingHighlights = (matches) =>
  matches.reduce((acc, curr, index, allHighlights) => {
    const { start, end } = curr;
    let isOverlap = false;

    allHighlights.forEach((highlight, i) => {
      // if this is the same highlight, skip
      if (i === index) {
        return;
      }

      const { start: compareStart, end: compareEnd } = highlight;

      if (
        (start > compareStart && start < compareEnd) ||
        (end > compareStart && end < compareEnd)
      ) {
        isOverlap = true;
      }
    });

    return acc || isOverlap;
  }, false);

// Wraps text in a <p> and inserts spans around selected phrases
// Highlights is a list of { regex, className } pairs - each 'regex' must have a capture group
// Returns JSX
export function insertSpans(text, highlights, options = { p: true }) {
  const matches = highlights
    .reduce((arr, highlight) => {
      if (!(highlight.text || highlight.regex))
        throw new Error(
          'insertSpan(): Each span must have either highlight.text or highlight.regex'
        );

      const regexStr = highlight.regex || escapeRegex(highlight.text);
      let regex;
      try {
        regex = new RegExp(regexStr, 'igd');
      } catch {
        // error handling in case of old safari, which doesn't accept `d` flag for regex
        regex = new RegExp(regexStr, 'ig');
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
    }, [])
    .sort((a, b) => a.start - b.start);

  if (matches.length === 0) return options.p ? <p>{text}</p> : text;

  // Look for overlapping highlights, which cause problems
  const overlappingHighlights = findOverlappingHighlights(matches);
  if (overlappingHighlights === true) {
    // eslint-disable-next-line no-console
    console.warn(`Found overlapping text highlights in card: ${text}`);
  }

  const output = matches.reduce(
    ({ offset, __html }, match) => {
      const el = match.element || 'span';
      const props = Object.entries(match.props || { class: match.className })
        .map(([k, v]) => (k && v ? `${k}="${v?.replace('"', '\\"')}"` : ''))
        .join(' ');

      const opening = `<${el} ${props}>`;
      const closing = `</${el}>`;
      const start = match.start + offset;
      const end = match.end + offset;

      return {
        offset: offset + opening.length + closing.length,
        __html: [
          __html.slice(0, start),
          opening,
          __html.slice(start, end),
          closing,
          __html.slice(end),
        ].join(''),
      };
    },
    { offset: 0, __html: text }
  );

  return options.p ? <p dangerouslySetInnerHTML={output} /> : output;
}

export default null;
