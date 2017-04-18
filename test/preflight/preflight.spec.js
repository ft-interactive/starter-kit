module.exports = {
  /**
   * Preflight rules
   * @author Ændrew Rininsland <andrew.rininsland@ft.com>
   *
   * These mainly check the existence of various meta data fields and ensures
   * tracking is installed. It does not verify whether tracking is working or
   * whether any of the meta values are correct.
   *
   * @param  {Nightwatch} client Nightwatch browser object
   * @return {void}
   */
  'load page': (client) => {
    client
      .url('http://localhost:3000')
      .pause(1000);
  },

  'HTML title tag should be present': (client) => {
    client.expect.element('title').to.be.present;
    client.getTitle(function assertTitle(title) {
      this.assert.notEqual(title, ''); // Assert style here because <title> is weird.
    });
  },

  'Twitter meta title should be present': (client) => {
    client.expect.element('meta[name="twitter:title"]')
      .to.be.present;
    client.expect.element('meta[name="twitter:title"]')
      .to.have.attribute('content').not.equal('');
  },

  'Open Graph meta title should be present': (client) => {
    client.expect.element('meta[property="og:title"]')
      .to.be.present;
    client.expect.element('meta[property="og:title"]')
      .to.have.attribute('content').not.equal('');
  },

  'HTML meta description should be present': (client) => {
    client.expect.element('meta[name="description"]')
      .to.be.present;
    client.expect.element('meta[name="description"]')
      .to.have.attribute('content').not.equal('');
  },

  'Twitter meta description should be present': (client) => {
    client.expect.element('meta[name="twitter:description"]')
      .to.be.present;
    client.expect.element('meta[name="twitter:description"]')
      .to.have.attribute('content').not.equal('');
  },

  'Open Graph meta description should be present': (client) => {
    client.expect.element('meta[property="og:description"]')
      .to.be.present;
    client.expect.element('meta[property="og:description"]')
      .to.have.attribute('content').not.equal('');
  },

  'Canonical link tag should be present': (client) => {
    client.expect.element('link[rel="canonical"]')
      .to.be.present;
    client.expect.element('link[rel="canonical"]')
      .to.have.attribute('href').not.equal('');
  },

  'Twitter meta url should be present': (client) => {
    client.expect.element('meta[name="twitter:url"]')
      .to.be.present;
    client.expect.element('meta[name="twitter:url"]')
      .to.have.attribute('content').not.equal('');
  },

  'Open Graph meta url should be present': (client) => {
    client.expect.element('meta[property="og:url"]')
      .to.be.present;
    client.expect.element('meta[property="og:url"]')
      .to.have.attribute('content').not.equal('');
  },

  'Sharing should be present': (client) => {
    client.expect.element('.o-share').to.be.present;
  },

  'Sharing "links" attribute should be present': (client) => {
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-links').not.equal('');
  },

  'Sharing "url" attribute should be present': (client) => {
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-url').not.equal('');
  },

  'Sharing "title" attribute should be present': (client) => {
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-title').not.equal('');
  },

  'Sharing "summary" attribute should be present': (client) => {
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-summary').not.equal('');
  },

  'Topic link should be populated': (client) => {
    client.expect.element('.o-typography-link-topic').to.be.present;
    client.expect.element('.o-typography-link-topic')
      .to.have.attribute('href').not.equal('');

    client.expect.element('.o-typography-link-topic')
      .text.to.not.equal('');
  },

  'Headline should be populated': (client) => {
    client.expect.element('h1.o-typography-heading1')
      .to.be.present;
    client.expect.element('h1.o-typography-heading1')
      .text.to.not.equal('');
  },


  // @TODO Add Onward Journey test
  // @TODO Find way of testing that tracking code is installed

  '~fin~': client => client.end(),
};
