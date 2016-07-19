import markdownIt from 'markdown-it';
import removeMarkdown from 'remove-markdown';

const days  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                  'September', 'October', 'November', 'December'];

export function ftdate(d) {
  const day = days[d.getUTCDay()];
  const month = months[d.getUTCMonth()];
  return !d ? '' : `${day}, ${d.getUTCDate()} ${month}, ${d.getUTCFullYear()}`;
}

const markdown = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
});

export function md(str, inline) {
  return !str ? '' : this.env.filters.safe(inline ? markdown.renderInline(str) : markdown.render(str));
}

export function plain(str, stripListLeaders=true) {
  return removeMarkdown(str, {stripListLeaders: stripListLeaders, gfm: true});
}
