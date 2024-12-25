/* eslint-disable @typescript-eslint/no-unused-vars */
import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, opts) => {
  type GateTuple = [string, 'AND' | 'OR' | 'XOR', string, string, string];
  const [stateInput, gates] = input
    .join('\n')
    .replaceAll(': ', ' ')
    .split('\n\n')
    .map((sections) =>
      sections
        .split('\n')
        .map((row) =>
          row
            .split(' ')
            .map((cell, i, rowArray) => (rowArray.length == 2 && i == 1 ? parseInt(cell) == 1 : cell))
        )
    ) as [[string, boolean][], GateTuple[]];

  const wires = gates.map((gate) => ({
    op: gate[1],
    a: gate[0],
    b: gate[2],
    result: gate[4]
  }));

  const state = new Map(stateInput);

  const processState = () => {
    while (true) {
      let solves = 0;
      for (const { a, op, b, result } of wires) {
        if (state.has(result) == false && state.has(a) && state.has(b)) {
          solves++;
          if (op == 'AND') {
            state.set(result, state.get(a)! && state.get(b)!);
          }
          if (op == 'OR') {
            state.set(result, state.get(a)! || state.get(b)!);
          }
          if (op == 'XOR') {
            state.set(result, Boolean(state.get(a)!) !== Boolean(state.get(b))!);
          }
        }
      }
      if (solves == 0) {
        break;
      }
    }
  };

  // Convert state to binary & extract number
  const binaryValue = (startsWith: string) =>
    parseInt(
      [...state.entries()]
        .filter(([a]) => a.startsWith(startsWith))
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([a, b]) => (b == true ? '1' : '0'))
        .join(''),
      2
    );

  if (part == 1) {
    processState();
    return binaryValue('z');
  }

  // Find the last gate
  const maxZ = wires
    .map((w) => w.result)
    .filter((w) => w.startsWith('z'))
    .map((w) => w.replace('z', ''))
    .map((w) => parseInt(w, 10))
    .reduce((a, b) => Math.max(a, b), 0);

  // These two comments broke it down pretty well
  // + Being hinted that it's a ripple carry adder
  // https://www.reddit.com/r/adventofcode/comments/1hl698z/comment/m3k68gd/
  // https://www.reddit.com/r/adventofcode/comments/1hl698z/comment/m3kt1je/
  // Otherwise it'd take days of me trying to burte force it, or i would've done it by hand like a lot of people with graphviz
  const wrongs = [] as string[];
  for (const { op, a, b, result } of wires) {
    // Any wire pushing to Z that's not an xor and is not the final entry
    if (result[0] == 'z' && op != 'XOR' && result !== `z${maxZ}`) {
      wrongs.push(result);
    }

    // Any XOR wire that grabs x,y & pushes it into z - straight up wrong
    if (
      op == 'XOR' &&
      !['x', 'y', 'z'].includes(a[0]) &&
      !['x', 'y', 'z'].includes(b[0]) &&
      !['x', 'y', 'z'].includes(result[0])
    ) {
      wrongs.push(result);
    }

    // Any AND wire connecting directly to non initial wire(x) - that pipes into another XOR or AND
    if (op == 'AND' && ![a, b].includes('x00')) {
      // If that pipes into an XOR or Another AND - it's wrong
      for (const subwire of wires) {
        if (subwire.op !== 'OR' && [subwire.a, subwire.b].includes(result)) {
          wrongs.push(result);
        }
      }
    }

    // Any XOR wire that merges into an OR wire
    if (op == 'XOR') {
      for (const subwire of wires) {
        if (subwire.op == 'OR' && [subwire.a, subwire.b].includes(result)) {
          wrongs.push(result);
        }
      }
    }
  }

  return wrongs.distinct().sort().join(',');
})
  .test(
    1,
    `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`.split('\n'),
    2024
  )
  .test(
    2,
    `x00: 0
x01: 1
x02: 0
x03: 1
x04: 0
x05: 1
y00: 0
y01: 0
y02: 1
y03: 1
y04: 0
y05: 1

x00 AND y00 -> z00
x01 AND y01 -> z01
x02 AND y02 -> z02
x03 AND y03 -> z03
x04 AND y04 -> z04
x05 AND y05 -> z05`.split('\n'),

    `z00,z01,z02,z03,z04,z05`
  );
