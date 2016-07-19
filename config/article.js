export default _ => ({

  // link file UUID
  id: '$uuid',

  // Appears in the HTML <title>
  title: '',

  // meta data
  description: '',

  // canonical URL of the published page
  // "$url" get filled in by the ./configure script
  url: '$url',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date(),

  headline: 'Politics and the English Language',

  summary: 'Political language is designed to make lies sound truthful and murder respectable, and to give an appearance of solidity to pure wind',

  topic: {
    name: 'Starter Kit',
    url: '/foo'
  },

  relatedArticle: {
    text: 'Related article »',
    url: 'https://en.wikipedia.org/wiki/Politics_and_the_English_Language'
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    {name: 'Author One', url: '/foo/bar'},
    {name: 'Author Two'},
  ],

  /*
  TODO: Select Twitter card type -
        "summary" or "summary_large_image"

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  // optional social meta data
  // twitterCreator: '@individual's_account',
  // tweetText:  '',
  // socialHeadline: '',
  // socialSummary:  '',

  onwardjourney: {

    // "list" (methode list) or "topic"
    type: '',

    // topic or list id
    id: '',

    // a heading is provided automatically if not set (peferred)
    heading: ''
  },
})
