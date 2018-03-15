function getCookie(cookieName) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${cookieName}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

/**
 * Get cohorts from Ammit
 * @return { Map }           Map object where key is the test name, value is
 * User's variant group (e.g. control, variant), will be overriden by
 * URL query parameter value if the key matches the Ammit test name
 */
export default async function getAmmitVariantGroups() {
  const urlOverrides = new URLSearchParams(location.search);

  const ftSessionToken = getCookie('FTSession_s');
  return fetch('https://ammit-api.ft.com/allocate', {
    headers: {
      'ft-session-token': ftSessionToken,
    },
  })
  .then(res => res.headers.get('x-ft-ab'))
  .then((allocation) => {
    // convert allocations string to a Map
    const allocations = allocation.split(',').map(v => v.split(':'));
    const ammitVariantGroups = new Map(allocations);

    // apply the overrides
    for (const urlOverride of urlOverrides.entries()) {
      ammitVariantGroups.set(urlOverride[0], urlOverride[1]);
    }

    // return Map object
    return new Map(ammitVariantGroups);
  }).catch((e) => {
    console.error(e);
    return new Map(urlOverrides);
  });
}
