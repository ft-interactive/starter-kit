// This object is turned into attrs on the <html> tag
export default ({ data: context }) => ({
  class: context.pageClasses,
  'data-build-time': context.buildTime,
  'data-content-id': context.id,
});
