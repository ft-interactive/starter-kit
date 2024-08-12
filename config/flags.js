/**
 * @file
 * Defines flags used to customise page behaviour.
 */

export default (environment = 'development') => ({
  prod: environment === 'production',
  analytics: environment === 'production',
  googleAnalytics: environment === 'production',
  ads: false,
  onwardjourney: true,
  shareButtons: true,
  header: true,
  footer: true,
  dark: false, // Dark theme support requires g-components >= 2.2.x
  mainImage: true,
  /*
    NOTE ABOUT COMMENTS:

    1)
    For comments to work locally you cannot run on
    localhost, you need an ft.com hostname
    Add the follow entry to the end of the hosts file

    127.0.0.1 ig-local.ft.com

    2)
    In order for comments to work the page needs a UUID.
    If you are yet to create an article UUID the following test UUID
    will be used

    3a499586-b2e0-11e4-a058-00144feab7de

  */
  comments: environment === 'production',
});
