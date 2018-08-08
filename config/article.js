/**
 * @file
 * Article-level configuration.
 *
 * @TODO Please ensure this file is filled out before publishing!!!
 */

export default (environment = 'development') => ({
  // link file UUID
  id: environment === 'development' ? '3a499586-b2e0-11e4-a058-00144feab7de' : '$URL',

  // canonical URL of the published page
  // "$URL" get filled in by the ./configure script
  url: 'http://local.ft.com:8080',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date().toISOString().replace(/:\d{2}\.\d{3}Z$/i, ''),

  headline: 'Ik kie neġi æpude pōsÞpriskribo',

  // summary === standfirst (Summary is what the content API calls it)
  summary:
    'Ik kie neġi æpude pōsÞpriskribo, anċ ēg tiel subtegmenÞo.'
    + 'Giga gārði esperǣntigo vi jes. Ċit plēj esceptīnte hu, ōl vola eksploðæ poǽ.',

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
      '"Disvastiĝo de Esperanto". Mapo pri Esperanto-grupoj en Eŭropo, farita de la frankfurta grupo, en Germana Esperantisto, marto 1905',
    credit: 'Wikipedia',

    // You can provide a UUID to an image and it was populate everything else
    // uuid: 'c4bf0be4-7c15-11e4-a7b8-00144feabdc0',

    // You can also provide a URL
    url:
      'https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F3%2F3a%2F1905-03-ge-frankf-mapo.jpg?source=ig',
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  bylines: [{ name: 'Author One', url: '/foo/bar' }, { name: 'Author Two' }],

  // Appears in the HTML <title>
  title: '',

  // meta data
  description: '',

  /*
  TODO: Select Twitter card type -
        "summary" or "summary_large_image"

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary_large_image',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  // socialImage: '',
  // socialHeadline: '',
  // socialDescription: '',
  // twitterCreator: '@author's_account', // shows up in summary_large_image cards

  // TWEET BUTTON CUSTOM TEXT
  // tweetText: '',
  //
  // Twitter lists these as suggested accounts to follow after a user tweets (do not include @)
  // twitterRelatedAccounts: ['authors_account_here', 'ftdata'],

  // Fill out the Facebook/Twitter metadata sections below if you want to
  // override the "General social" options above

  // TWITTER METADATA (for Twitter cards)
  // twitterImage: '',
  // twitterHeadline: '',
  // twitterDescription: '',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',
  // facebookDescription: '',

  // ADVERTISING
  ads: {
    // Ad unit hierarchy makes ads more granular.
    gptSite: 'ft.com',
    // Start with ft.com and /companies /markets /world as appropriate to your story
    gptZone: false,
    // granular targeting is optional and will be specified by the ads team
    dfpTargeting: false,
  },

  tracking: {
    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',
    /*
    Product name

    This will usually default to "IG"
    however another value may be needed
    */
    // product: '',
  },
});
