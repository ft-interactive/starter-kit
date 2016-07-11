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
  'load page': client => {
    client
      .url('http://localhost:3000')
      .pause(1000);
  },

  'HTML title tag should be present': client => {
    client.expect.element('title').to.be.present;
    client.getTitle(function (title) { // eslint-disable-line func-names
      this.assert.notEqual(title, '@@TITLE'); // Assert style here because <title> is weird.
      this.assert.notEqual(title, '');
    });
  },

  'Twitter meta title should be present': client => {
    client.expect.element('meta[name="twitter:title"]')
      .to.be.present;
    client.expect.element('meta[name="twitter:title"]')
      .to.have.attribute('content').not.equal('@@TITLE');
    client.expect.element('meta[name="twitter:title"]')
      .to.have.attribute('content').not.equal('');
  },

  'Open Graph meta title should be present': client => {
    client.expect.element('meta[property="og:title"]')
      .to.be.present;
    client.expect.element('meta[property="og:title"]')
      .to.have.attribute('content').not.equal('@@TITLE');
    client.expect.element('meta[property="og:title"]')
      .to.have.attribute('content').not.equal('');
  },

  'HTML meta description should be present': client => {
    client.expect.element('meta[name="description"]')
      .to.be.present;
    client.expect.element('meta[name="description"]')
      .to.have.attribute('content').not.equal('@@DESCRIPTION');
    client.expect.element('meta[name="description"]')
      .to.have.attribute('content').not.equal('');
  },

  'Twitter meta description should be present': client => {
    client.expect.element('meta[name="twitter:description"]')
      .to.be.present;
    client.expect.element('meta[name="twitter:description"]')
      .to.have.attribute('content').not.equal('@@DESCRIPTION');
    client.expect.element('meta[name="twitter:description"]')
      .to.have.attribute('content').not.equal('');
  },

  'Open Graph meta description should be present': client => {
    client.expect.element('meta[property="og:description"]')
      .to.be.present;
    client.expect.element('meta[property="og:description"]')
      .to.have.attribute('content').not.equal('@@DESCRIPTION');
    client.expect.element('meta[property="og:description"]')
      .to.have.attribute('content').not.equal('');
  },

  'Canonical link tag should be present': client => {
    client.expect.element('link[rel="canonical"]')
      .to.be.present;
    client.expect.element('link[rel="canonical"]')
      .to.have.attribute('href').not.equal('@@URL');
    client.expect.element('link[rel="canonical"]')
      .to.have.attribute('href').not.equal('');
  },

  'Twitter meta url should be present': client => {
    client.expect.element('meta[name="twitter:url"]')
      .to.be.present;
    client.expect.element('meta[name="twitter:url"]')
      .to.have.attribute('content').not.equal('@@URL');
    client.expect.element('meta[name="twitter:url"]')
      .to.have.attribute('content').not.equal('');
  },

  'Open Graph meta url should be present': client => {
    client.expect.element('meta[property="og:url"]')
      .to.be.present;
    client.expect.element('meta[property="og:url"]')
      .to.have.attribute('content').not.equal('@@URL');
    client.expect.element('meta[property="og:url"]')
      .to.have.attribute('content').not.equal('');
  },

  'Image link tag should be present': client => {
    client.expect.element('link[rel="image_src"]')
      .to.be.present;
    client.expect.element('link[rel="image_src"]')
      .to.have.attribute('href').not.equal('@@IMAGE');
    client.expect.element('link[rel="image_src"]')
      .to.have.attribute('href').not.equal('');
  },

  'Twitter meta image should be present': client => {
    client.expect.element('meta[name="twitter:image"]')
      .to.be.present;
    client.expect.element('meta[name="twitter:image"]')
      .to.have.attribute('content').not.equal('@@IMAGE');
    client.expect.element('meta[name="twitter:image"]')
      .to.have.attribute('content').not.equal('');
  },

  'Open Graph meta image should be present': client => {
    client.expect.element('meta[property="og:image"]')
      .to.be.present;
    client.expect.element('meta[property="og:image"]')
      .to.have.attribute('content').not.equal('@@IMAGE');
    client.expect.element('meta[property="og:image"]')
      .to.have.attribute('content').not.equal('');
  },

  'If optional author info is present, check it is defined': client => {
    client.element('css selector', 'meta[name="twitter:creator"]', result => {
      if (result.value && result.value.ELEMENT) {
        client.expect.element('meta[name="twitter:creator"]')
          .to.have.attribute('content').not.equal('@individual_account');
        client.expect.element('meta[name="twitter:creator"]')
          .to.have.attribute('content').not.equal('');

        client.expect.element('meta[property="article:author"]')
          .to.have.attribute('content').not.equal('');
      }
    });
  },

  'Tracking code should be present': client => {
    client.expect
      .element('script[src="https://origami-build.ft.com/v2/bundles/js?modules=o-tracking"]')
      .to.be.present.before(1000);
  },

  'Sharing should be present': client => {
    client.expect.element('.o-share').to.be.present;
  },

  'Sharing "links" attribute should be present': client => {
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-links').not.equal('{{links}}');
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-links').not.equal('');
  },

  'Sharing "url" attribute should be present': client => {
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-url').not.equal('{{url}}');
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-url').not.equal('');
  },

  'Sharing "title" attribute should be present': client => {
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-title').not.equal('{{title}}');
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-title').not.equal('');
  },

  'Sharing "title extra" attribute should be present': client => {
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-titleExtra').not.equal('{{titleExtra}}');
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-titleExtra').not.equal('');
  },

  'Sharing "summary" attribute should be present': client => {
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-summary').not.equal('{{summary}}');
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-summary').not.equal('');
  },

  '~fin~': client => {
    client.end();
  },
};
