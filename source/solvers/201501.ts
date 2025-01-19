import '../utils';
import { EarlyReturn } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) =>
  input
    .join('')
    .split('')
    .map((value) => (value == '(' ? 1 : -1) as number)
    .abortable((array) =>
      array.reduce((previous, current, index) => {
        if (part == 2 && previous + current == -1) {
          throw new EarlyReturn(index + 1);
        }
        return previous + current;
      }, 0)
    )
)
  .test(1, `)())())`.split('\n'), -3)
  .test(2, ')'.split('\n'), 1);
