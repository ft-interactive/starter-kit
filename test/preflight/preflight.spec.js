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
    client.getTitle(function assertTitle(title) {
      this.assert.notEqual(title, ''); // Assert style here because <title> is weird.
    });
  },

  'Twitter meta title should be present': client => {
    client.expect.element('meta[name="twitter:title"]')
      .to.be.present;
    client.expect.element('meta[name="twitter:title"]')
      .to.have.attribute('content').not.equal('');
  },

  'Open Graph meta title should be present': client => {
    client.expect.element('meta[property="og:title"]')
      .to.be.present;
    client.expect.element('meta[property="og:title"]')
      .to.have.attribute('content').not.equal('');
  },

  'HTML meta description should be present': client => {
    client.expect.element('meta[name="description"]')
      .to.be.present;
    client.expect.element('meta[name="description"]')
      .to.have.attribute('content').not.equal('');
  },

  'Twitter meta description should be present': client => {
    client.expect.element('meta[name="twitter:description"]')
      .to.be.present;
    client.expect.element('meta[name="twitter:description"]')
      .to.have.attribute('content').not.equal('');
  },

  'Open Graph meta description should be present': client => {
    client.expect.element('meta[property="og:description"]')
      .to.be.present;
    client.expect.element('meta[property="og:description"]')
      .to.have.attribute('content').not.equal('');
  },

  'Canonical link tag should be present': client => {
    client.expect.element('link[rel="canonical"]')
      .to.be.present;
    client.expect.element('link[rel="canonical"]')
      .to.have.attribute('href').not.equal('');
  },

  'Twitter meta url should be present': client => {
    client.expect.element('meta[name="twitter:url"]')
      .to.be.present;
    client.expect.element('meta[name="twitter:url"]')
      .to.have.attribute('content').not.equal('');
  },

  'Open Graph meta url should be present': client => {
    client.expect.element('meta[property="og:url"]')
      .to.be.present;
    client.expect.element('meta[property="og:url"]')
      .to.have.attribute('content').not.equal('');
  },

  'Image link tag should be present': client => {
    client.expect.element('link[rel="image_src"]')
      .to.be.present;
    client.expect.element('link[rel="image_src"]')
      .to.have.attribute('href').not.equal('');
  },

  'Twitter meta image should be present': client => {
    client.expect.element('meta[name="twitter:image"]')
      .to.be.present;
    client.expect.element('meta[name="twitter:image"]')
      .to.have.attribute('content').not.equal('');
  },

  'Open Graph meta image should be present': client => {
    client.expect.element('meta[property="og:image"]')
      .to.be.present;
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

  'If optional ft.track:product tag is present, check it is defined': client => {
    client.element('css selector', 'meta[property="ft.track:product"]', result => {
      if (result.value && result.value.ELEMENT) {
        client.expect.element('meta[property="ft.track:product"]')
          .to.have.attribute('content').not.equal('');
      }
    });
  },

  'If optional ft.track:microsite_name tag is present, check it is defined': client => {
    client.element('css selector', 'meta[property="ft.track:microsite_name"]', result => {
      if (result.value && result.value.ELEMENT) {
        client.expect.element('meta[property="ft.track:microsite_name"]')
          .to.have.attribute('content').not.equal('');
      }
    });
  },

  'Tracking code should be present': client => {
    client.expect
      .element('img[src*="https://spoor-api.ft.com/px.gif"]')
      .to.be.present.before(1000);
  },

  'Sharing should be present': client => {
    client.expect.element('.o-share').to.be.present;
  },

  'Sharing "links" attribute should be present': client => {
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-links').not.equal('');
  },

  'Sharing "url" attribute should be present': client => {
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-url').not.equal('');
  },

  'Sharing "title" attribute should be present': client => {
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-title').not.equal('');
  },

  'Sharing "summary" attribute should be present': client => {
    client.expect.element('.o-share')
      .to.have.attribute('data-o-share-summary').not.equal('');
  },

  'Topic link should be populated': client => {
    client.expect.element('.o-typography-link-topic').to.be.present;
    client.expect.element('.o-typography-link-topic')
      .to.have.attribute('href').not.equal('');

    client.expect.element('.o-typography-link-topic')
      .text.to.not.equal('');
  },

  'Headline should be populated': client => {
    client.expect.element('h1.o-typography-heading1')
      .to.be.present;
    client.expect.element('h1.o-typography-heading1')
      .text.to.not.equal('');
  },

  'If optional related article tag is present, check it is defined': client => {
    client.element('css selector', '.o-typography-lead > .o-typography-link', result => {
      if (result.value && result.value.ELEMENT) {
        client.expect.element('.o-typography-lead > .o-typography-link')
          .to.have.attribute('href').not.equal('');
        client.expect.element('.o-typography-lead > .o-typography-link')
          .text.to.not.equal('');
      }
    });
  },

  'If optional timestamp tag is present, check it is defined': client => {
    client.element('css selector', '.article__timestamp', result => {
      if (result.value && result.value.ELEMENT) {
        client.expect.element('.article__timestamp')
          .text.to.not.equal('');
      }
    });
  },

  'If optional byline tag is present, check it is populated': client => {
    client.element('css selector', '.article__byline', result => {
      if (result.value && result.value.ELEMENT) {
        client.expect.element('.article__byline')
          .text.to.not.equal('&#32;by&nbsp;');
      }
    });
  },

  '~fin~': client => client.end(),
};
