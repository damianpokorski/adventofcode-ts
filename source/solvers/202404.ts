import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  return 'Ready to go :)';
});
