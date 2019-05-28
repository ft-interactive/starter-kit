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
    }),
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
    }),
  ),
  buildTime: PropTypes.string,
};

export const ContextDefaultProps = {
  id: '3a499586-b2e0-11e4-a058-00144feab7de',
  url: 'https://ig.ft.com/',
  publishedDate: new Date().toISOString(),
  headline: 'Ik kie neġi æpude pōsÞpriskribo',
  summary:
    'Ik kie neġi æpude pōsÞpriskribo, anċ ēg tiel subtegmenÞo.Giga gārði esperǣntigo vi jes. Ċit plēj esceptīnte hu, ōl vola eksploðæ poǽ.',
  topic: {
    name: 'Starter Kit',
    url: '/foo',
  },
  relatedArticle: {
    text: 'Related article »',
    url: 'https://en.wikipedia.org/wiki/Esperanto',
  },
  mainImage: {
    title: 'Map of Esperanto groups in Europe in 1905',
    description:
      'Disvastiĝo de Esperanto. Mapo pri Esperanto-grupoj en Eŭropo, farita de la frankfurta grupo, en Germana Esperantisto, marto 1905',
    credit: 'Wikipedia',
    url:
      'https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F3%2F3a%2F1905-03-ge-frankf-mapo.jpg?source=ig',
  },
  bylines: [
    {
      name: 'Author One',
      url: '/foo/bar',
    },
    {
      name: 'Author Two',
    },
  ],
  title: '',
  description: '',
  twitterCard: 'summary_large_image',
  ads: {
    gptSite: 'ft.com',
    gptZone: false,
    dfpTargeting: false,
  },
  tracking: {},
  flags: {
    prod: false,
    errorReporting: true,
    analytics: true,
    googleAnalytics: false,
    ads: true,
    onwardjourney: true,
    shareButtons: true,
    header: true,
    footer: true,
    dark: false,
    comments: true,
  },
  relatedContent: [
    {
      rows: 2,
      list: 'thing/adae44ca-4ea7-3cf8-8332-bf85ec89a558',
    },
  ],
  buildTime: new Date().toISOString(),
};

export default null;
