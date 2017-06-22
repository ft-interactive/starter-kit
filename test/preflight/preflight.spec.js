/**
 * Preflight rules
 * @author Ændrew Rininsland <andrew.rininsland@ft.com>
 *
 * These mainly check the existence of various meta data fields and ensures
 * tracking is installed. It does not verify whether tracking is working or
 * whether any of the meta values are correct.
 */

describe('preflight tests', () => {
  describe('dist/index.html', () => {
    // Parse index.html into a DOM and run tests
    const parser = new DOMParser();
    const doc = parser.parseFromString(__html__['dist/index.html'], 'text/html');

    it('has a HTML title tag', () => {
      const title = doc.querySelector('title');
      should.exist(title);
      title.textContent.should.not.equal('');
    });

    it('has a Twitter meta title', () => {
      const twitterMetaTitle = doc.querySelector('meta[name="twitter:title"]');
      should.exist(twitterMetaTitle);
      twitterMetaTitle.getAttribute('content').should.not.equal('');
    });

    it('has a Open Graph meta title', () => {
      const ogMetaTitle = doc.querySelector('meta[property="og:title"]');
      should.exist(ogMetaTitle);
      ogMetaTitle.getAttribute('content').should.not.equal('');
    });

    it('has a HTML meta description', () => {
      const metaDesc = doc.querySelector('meta[name="description"]');
      should.exist(metaDesc);
      metaDesc.getAttribute('content').should.not.equal('');
    });

    it('has a Twitter meta description', () => {
      const twitterDesc = doc.querySelector('meta[name="twitter:description"]');
      should.exist(twitterDesc);
      twitterDesc.getAttribute('content').should.not.equal('');
    });

    it('has a Open Graph meta description', () => {
      const ogDesc = doc.querySelector('meta[property="og:description"]');
      should.exist(ogDesc);
      ogDesc.getAttribute('content').should.not.equal('');
    });

    it('has a Canonical link tag', () => {
      const canonicalLink = doc.querySelector('link[rel="canonical"]');
      should.exist(canonicalLink);
      canonicalLink.getAttribute('href').should.not.equal('');
    });

    it('has a Twitter meta url', () => {
      const twitterUrl = doc.querySelector('meta[name="twitter:url"]');
      should.exist(twitterUrl);
      twitterUrl.getAttribute('content').should.not.equal('');
    });

    it('has a Open Graph meta url', () => {
      const ogUrl = doc.querySelector('meta[property="og:url"]');
      should.exist(ogUrl);
      ogUrl.getAttribute('content').should.not.equal('');
    });

    it('has o-sharing', () => {
      const oShare = doc.querySelector('.o-share');
      should.exist(oShare);
    });

    it('has a populated topic link', () => {
      const topicLink = doc.querySelector('.o-typography-link-topic');

      should.exist(topicLink);
      topicLink.textContent.should.not.equal('');
      topicLink.getAttribute('href').should.not.equal('');
    });

    it('has a populated headline', () => {
      const headline = doc.querySelector('h1.o-typography-heading1');

      should.exist(headline);
      headline.textContent.should.not.equal('');
    });

    // @TODO Add Onward Journey test
    // @TODO Find way of testing that tracking code is installed
  });
});
