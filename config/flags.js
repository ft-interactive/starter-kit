const prod = process.env.NODE_ENV === 'production';

export default {
  prod: prod,
  errorReporting: prod,
  googleAnalytics: prod,
  ads: true,
  onwardjourney: true,
  shareButtons: true,
  header: true,
  footer: true,

}
