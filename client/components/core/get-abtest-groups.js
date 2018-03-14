function getCookie(cookieName) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${cookieName}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

function getURLQueryParams(url) {
  const urlParams = {};
  url.replace(
    new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
    ($0, $1, $2, $3) => {
      urlParams[$1] = $3;
    },
  );
  return urlParams;
}

/**
 * Get cohorts from Ammit
 * @return {Object}           Hash where key is the test name, value is
 * User's variant group (e.g. control, variant), will be overriden by
 * URL query parameter value if the key matches the Ammit test name
 */
export default async function getAmmitVariantGroups() {
  const urlOverrides = getURLQueryParams(location.search);

  const ftSessionToken = getCookie('FTSession');
  return fetch('https://ammit-api.ft.com/allocate', {
    headers: {
      'ft-session-token': ftSessionToken,
    },
  })
  .then(res => res.headers.get('x-ft-ab'))
  .then((allocation) => {
    const allocations = allocation.split(',');
    const ammitVariantGroups = {};
    for (let i = 0; i < allocations.length; i += 1) {
      const testName = allocations[i].split(':')[0];
      const variantGroup = allocations[i].split(':')[1];
      ammitVariantGroups[testName] = urlOverrides[testName] || variantGroup;
    }
    return ammitVariantGroups;
  }).catch(() => urlOverrides);
}
