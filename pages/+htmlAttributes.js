// This version currently doesn't work, because vite-react has a bug:
// https://github.com/vikejs/vike-react/issues/82#issuecomment-2286323622
// export default ({ data: context }) => ({
//   class: context.pageClasses,
//   'data-build-time': context.buildTime,
//   'data-content-id': context.id,
// });

export default {
  class: 'core',
  'data-build-time': new Date().toISOString(),
  'data-content-id': 'paste-temp-uuid-value-here',
};
