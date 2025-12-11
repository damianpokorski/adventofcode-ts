// import memoize from 'memoize';
import '../utils';
import { memoize } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, { isTest }) => {
  const nodeNames = [] as string[];
  const hash = (id: string) => {
    if (nodeNames.indexOf(id) == -1) {
      nodeNames.push(id);
    }
    return nodeNames.indexOf(id);
  };
  const map = new Map<string, string[]>();
  const fastMap = new Map<number, number[]>();
  for (const line of input) {
    const [start, endsRaw] = line.split(': ');
    const ends = endsRaw.split(' ');
    map.set(start, ends);
    fastMap.set(
      hash(start),
      ends.map((end) => hash(end))
    );
  }

  // Sections to hit - after analyzing graph with graphviz, you can see choke points within part 2
  const pairs =
    part == 1
      ? [['you', 'out']]
      : [
          ['svr', 'fft'],
          ['fft', 'dac'],
          ['dac', 'out']
        ];

  const results: number[] = [1];

  for (const [start, end] of pairs) {
    const traverse = memoize(
      (key: string, goal?: string | undefined): number => {
        const next = map.get(key) ?? [];
        let total = 0;
        for (let i = 0; i < next.length; i++) {
          total += traverse(next[i], goal);
          if (next[i] == goal) {
            total++;
          }
        }
        return total;
      },
      (key) => key
    );
    results.push(traverse(start, end));
  }
  return results.reduce((a, b) => a * b);
})
  .test(
    1,
    `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`.split('\n'),
    5
  )
  .test(
    2,
    `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`.split('\n'),
    2
  );
