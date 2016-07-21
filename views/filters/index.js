import markdownIt from 'markdown-it';
import removeMarkdown from 'remove-markdown';
import nunjucks from 'nunjucks';

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
  return !str ? '' : new nunjucks.runtime.SafeString(inline ? markdown.renderInline(str) : markdown.render(str));
}

export function plain(str, stripListLeaders=true) {
  return removeMarkdown(str, {stripListLeaders: stripListLeaders, gfm: true});
}

export function encodedJSON(str) {
  try {
    return encodeURIComponent(JSON.stringify(JSON.parse(str || ''), null, ''));
  } catch (e) {
    return '';
  }
}

export function spoorTrackingPixel(str) {
  const json = encodedJSON(str.trim());
  const img = `<img src="https://spoor-api.ft.com/px.gif?data=${json}" height="1" width="1" />`;
  return new nunjucks.runtime.SafeString(`<!--[if lt IE 9]>
    ${img}
    <![endif]-->
    <noscript data-o-component="o-tracking">${img}</noscript>`);
}
