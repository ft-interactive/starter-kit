const prod = process.env.NODE_ENV === 'production';

export default {
  errorReporting: prod,
  googleAnalytics: prod
}
