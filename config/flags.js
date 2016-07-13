const prod = process.env.NODE_ENV === 'production';

export default {
  prod: prod,
  errorReporting: prod,
  googleAnalytics: prod,
  ads: true,
  onwardjourney: true,
  shareButtons: true,

  /*
    For comments to work locally you cannot run on
    localhost, you need an ft.com hostname
    Add the follow entry to the end of the hosts file

    127.0.0.1 local.dev.ft.com
  */
  comments: true,

  header: true,
  footer: true,

}
