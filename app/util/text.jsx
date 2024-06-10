import React from 'react';

const escapeRegex = (text) => `(${text?.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')})`;

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
  const matches = highlights.reduce((arr, highlight) => {
    if (!(highlight.text || highlight.regex))
      throw new Error('insertSpan(): Each span must have either highlight.text or highlight.regex');

    const regexStr = highlight.regex || escapeRegex(highlight.text);
    const regex = new RegExp(regexStr, 'igd');

    let match;
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(text))) {
      // Add all capture groups (but not the whole string) to the list
      const { indices } = match;
      arr.push(
        ...match.slice(1).map((group, i) => ({
          ...highlight,
          match: group,
          start: indices[i + 1][0],
          end: indices[i + 1][1],
        }))
      );
    }
    return arr;
  }, []);

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
