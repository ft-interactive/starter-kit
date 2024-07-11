import getConfig from '../config';

export async function data() {
  const context = await getConfig(import.meta.env.MODE);

  return context;
}
