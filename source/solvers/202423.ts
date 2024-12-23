import { combinations } from 'obliterator';
import '../utils';
import { initialize } from '../utils/registry';

const pairs = (array: string[]) => array.flatMap((a, i) => array.slice(i + 1).map((b) => [a, b]));

initialize(__filename, async (part, input) => {
  const network = new Map<string, string[]>();

  for (const [l, r] of input.map((line) => line.split('-') as [string, string])) {
    network.set(l, [...(network.get(l) ?? []), r]);
    network.set(r, [...(network.get(r) ?? []), l]);
  }

  if (part == 1) {
    const triangleNetworks = new Set<string>();

    for (const [aID, aPeers] of network.entries()) {
      for (const bID of aPeers) {
        for (const bPeer of network.get(bID) ?? []) {
          if (aPeers.includes(bPeer)) {
            const cID = bPeer; // Promiting a bPeer to cID
            triangleNetworks.add([aID, bID, cID].sort().join(','));
          }
        }
      }
    }

    return triangleNetworks
      .values()
      .filter((ids) => ids.split(',').some((id) => id.startsWith('t')))
      .toArray()
      .distinct().length;
  }

  let largest = [] as string[];
  // Find
  for (const [root, peers] of network) {
    // Keep going through combinations of sizes
    for (let i = Math.max(1, largest.length - 1); i < peers.length; i++) {
      for (const perm of combinations(peers, i)) {
        if (perm.length > largest.length) {
          // Check if all of the nodes are interconnected
          if (pairs([root, ...perm]).every(([a, b]) => network.has(a) && network.get(a)?.includes(b))) {
            largest.length = perm.length;
            largest = [root, ...perm];
          }
        }
      }
    }
  }

  return largest.sort().join(',');
}).tests(
  `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`.split('\n'),
  7,
  'co,de,ka,ta'
);
