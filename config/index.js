import article from './article';
import flags from './flags';

export default function() {
  return {
    ...article(),
    flags: flags()
  }
}
