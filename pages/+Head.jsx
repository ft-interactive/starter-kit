import React, { Fragment } from 'react';

import { useData } from 'vike-react/useData';

const getLogo = (params) => {
  const paramsStr = new URLSearchParams({ source: 'ig-projects', ...params }).toString();

  return `https://www.ft.com/__origami/service/image/v2/images/raw/ftlogo-v1%3Abrand-ft-logo-square-coloured?${paramsStr}`;
};

export const Head = () => {
  const context = useData();

  return (
    <Fragment>
      <title>{context.title}</title>

      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <link rel="icon" type="image/svg+xml" href={getLogo()} />
      <link
        rel="alternate icon"
        type="image/png"
        href={getLogo({ width: 32, height: 32, format: 'png' })}
        sizes="32x32"
      />
      <link
        rel="alternate icon"
        type="image/png"
        href={getLogo({ width: 194, height: 194, format: 'png' })}
        sizes="194x194"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={getLogo({ width: 180, height: 180, format: 'png' })}
      />
      <meta name="format-detection" content="telephone=no" />
      <meta name="robots" content="index,follow" />
      <meta name="copyright" content="Financial Times" />
      <meta name="theme-color" content="#fff1e5" />

      {/* eslint-disable */}
      {context.flags.data && context.dataMeta && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(context.dataMeta) }}
        ></script>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'http://schema.org',
            '@type': 'WebSite',
            name: 'Financial Times',
            alternateName: 'FT.com',
            url: 'http://www.ft.com',
          }),
        }}
      ></script>

      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
  window.cutsTheMustard =
    'querySelector' in document &&
    'localStorage' in window &&
    'addEventListener' in window &&
    typeof Function.prototype.bind !== 'undefined';

  if (window.cutsTheMustard)
    document.documentElement.className = document.documentElement.className.replace(
      /core/g,
      'enhanced'
    );
        `,
        }}
      ></script>
      {/* eslint-enable */}

      {context.flags.analytics && (
        <Fragment>
          <link rel="preconnect" href="https://spoor-api.ft.com" />
          <meta property="ft.track:is_live" content="true" />
        </Fragment>
      )}

      {context.tracking.product && (
        <meta property="ft.track:product" content={context.tracking.product} />
      )}

      {context.tracking.micrositeName && (
        <meta property="ft.track:microsite_name" content={context.tracking.micrositeName} />
      )}

      <meta
        name="twitter:title"
        content={context.twitterHeadline || context.socialHeadline || context.headline}
      />
      <meta
        property="og:title"
        content={context.facebookHeadline || context.socialHeadline || context.headline}
      />

      <meta name="description" content={context.description || context.summary} />
      <meta
        name="twitter:description"
        content={
          context.twitterDescription ||
          context.socialDescription ||
          context.description ||
          context.summary
        }
      />
      <meta
        property="og:description"
        content={
          context.facebookDescription ||
          context.socialDescription ||
          context.description ||
          context.summary
        }
      />

      <link rel="canonical" href={context.url} />
      <meta name="twitter:url" content={context.url} />
      <meta property="og:url" content={context.url} />

      {context.mainImage.url && (
        /* eslint-disable-next-line react/no-invalid-html-attribute */
        <link rel="image_src" href={context.mainImage.url} />
      )}

      {(context.twitterImage || context.socialImage || context.mainImage.url) && (
        <meta
          name="twitter:image"
          content={context.twitterImage || context.socialImage || context.mainImage.url}
        />
      )}

      {(context.facebookImage || context.socialImage || context.mainImage.url) && (
        <meta
          property="og:image"
          content={context.facebookImage || context.socialImage || context.mainImage.url}
        />
      )}

      <meta name="twitter:card" content={context.twitterCard} />
      <meta name="twitter:site" content="@FT" />

      {context.twitterCreator && <meta name="twitter:creator" content={context.twitterCreator} />}

      <meta property="fb:pages" content="8860325749" />
      <meta property="fb:pages" content="121862597867466" />
      <meta property="fb:pages" content="622419751233155" />
      <meta property="fb:pages" content="23117544640" />
      <meta property="fb:pages" content="293710391064899" />
    </Fragment>
  );
};
