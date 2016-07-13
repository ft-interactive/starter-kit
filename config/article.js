export default {
  // link file UUID
  id: '$uuid',

  // Appears in the HTML <title>
  title: '',

  // meta data
  description: '',

  // canonical URL of the published page
  url: '$url',

  // To set an exact publish date do this: 
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date(),

  headline: 'Politics and the English Language',

  summary: 'Political language is designed to make lies sound truthful and murder respectable, and to give an appearance of solidity to pure wind',

  topic: 'Starter Kit',
  topicUrl: '/foo',
  relatedArticle: {
    text: 'Related article »',
    url: 'https://en.wikipedia.org/wiki/Politics_and_the_English_Language'
  },

  /*
  TODO: Select Twitter card type -
        "summary" or "summary_large_image"

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  // optional social meta data
  // twitterCreator: '@individual's_account'
  // socialHeadline: 'this is the social headline'
}
