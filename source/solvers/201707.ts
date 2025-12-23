import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, { isTest, verbose }) => {
  // Create hash maps
  const weights = new Map<string, number>();
  const children = new Map<string, string[]>();
  const parents = new Map<string, string>();

  for (const line of input) {
    // Parse
    const [nodeRaw, childNodesRaw] = line.split(' -> ');
    const [node, weightRaw] = nodeRaw
      .replace(' (', ' ')
      .replace(')', '')
      .split(' ');
    const childNodes = (childNodesRaw ?? '')
      .split(', ')
      .filter((node) => node !== '');

    // Save into hash maps
    children.set(node, childNodes);
    weights.set(node, parseInt(weightRaw, 10));
    for (const childNode of childNodes) {
      parents.set(childNode, node);
    }
  }
  const nodes = [...weights.keys()];
  // Part 1

  let root = '';
  for (const node of nodes) {
    if (parents.has(node) == false) {
      root = node;
      if (part == 1) {
        return root;
      }
    }
  }

  // Total weight calculation
  const totalWeights = new Map<string, number>();

  const recursiveWeight = (node: string) => {
    // Already calculated
    if (totalWeights.has(node)) {
      return totalWeights.get(node)!;
    }
    let total = 0;
    for (const child of children.get(node) ?? []) {
      total += recursiveWeight(child);
    }
    totalWeights.set(node, total + weights.get(node)!);
    return totalWeights.get(node)!;
  };
  // Start at root & calculate using bfs (bottom up) recursively
  recursiveWeight(root);

  // Compare nodes weight against it's siblings weights, in case of a diff - check child nodes
  for (const node of nodes) {
    const siblings =
      children.get(parents.get(node)!)?.filter((sibling) => sibling !== node) ??
      [];

    // If there's 0 siblings, we're the top node
    // If sibling weights are different - continue, it's the sibling that's unbalanced
    const siblingWeights = siblings.map(
      (sibling) => totalWeights.get(sibling)!
    )!;
    if (siblingWeights.distinct().length !== 1) {
      continue;
    }
    const expectedWeight = siblingWeights.shift()!;
    const nodeWeight = totalWeights.get(node)!;
    if (expectedWeight !== nodeWeight) {
      // Check if all children weights are the same
      if (
        children
          .get(node)!
          .map((child) => totalWeights.get(child))
          .distinct().length == 1
      ) {
        return weights.get(node)! - (nodeWeight - expectedWeight);
      }
    }
  }
}).tests(
  `pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`.split('\n'),
  `tknk`,
  60
);
