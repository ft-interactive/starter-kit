import vikeReact from 'vike-react/config';

export default {
  extends: [vikeReact],
  prerender: true,
  ssr: true,
  passToClient: ['context'],
};
