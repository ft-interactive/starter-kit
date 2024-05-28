/**
 * @file
 * Shared custom prop-types
 */

import PropTypes from 'prop-types';

export const ContextPropType = {
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  publishedDate: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  topic: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  relatedArticle: PropTypes.shape({
    text: PropTypes.string,
    url: PropTypes.string,
  }),
  mainImage: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    credit: PropTypes.string,
    url: PropTypes.string,
  }),
  bylines: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string,
    })
  ).isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  twitterCard: PropTypes.string,
  ads: PropTypes.shape({
    gptSite: PropTypes.string,
    gptZone: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    dfpTargeting: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }).isRequired,
  tracking: PropTypes.any,
  flags: PropTypes.shape({
    prod: PropTypes.bool,
    errorReporting: PropTypes.bool,
    analytics: PropTypes.bool,
    googleAnalytics: PropTypes.bool,
    ads: PropTypes.bool,
    onwardjourney: PropTypes.bool,
    shareButtons: PropTypes.bool,
    header: PropTypes.bool,
    footer: PropTypes.bool,
    dark: PropTypes.bool,
    comments: PropTypes.bool,
  }).isRequired,
  relatedContent: PropTypes.arrayOf(
    PropTypes.shape({
      rows: PropTypes.number.isRequired,
      list: PropTypes.string.isRequired,
    })
  ),
  data: PropTypes.object,
  buildTime: PropTypes.string,
};

export default null;
