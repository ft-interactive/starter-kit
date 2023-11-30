import React, { lazy, useState, Suspense } from 'react';
import PropTypes from 'prop-types';

/**
 * Loads and renders a component on the client-side, excluding it
 * (and all its children) from the server-side render.
 *
 * Example usage:
 * <LazyLoad component={() => import('./MyComponent')} props={{ ... }} />
 *
 * @param {function} component A function that dynamically imports a React component
 * @param {object} props A set of props to pass to the component
 * @returns
 */
const LazyLoad = ({ component, props = {}, loading = 'Loading...' }) => {
  const [Component, setComponent] = useState(null);

  React.useEffect(() => {
    setComponent(() => lazy(component));
  }, [component]);

  return <Suspense fallback={loading}>{Component ? <Component {...props} /> : loading}</Suspense>;
};

LazyLoad.propTypes = {
  component: PropTypes.node.isRequired,
  props: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  loading: PropTypes.node,
};

export default LazyLoad;
