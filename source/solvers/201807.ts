import '../utils';
import { debug } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, { isTest, verbose }) => {
  const requirements = new Map<string, string[]>();
  const nodes = new Set<string>();
  for (const line of input) {
    const [b, a] = line
      .discard('Step ', 'must be finished before step ', ' can begin.')
      .split(' ');

    nodes.add(a);
    nodes.add(b);

    requirements.set(a, [...(requirements.get(a) ?? []), b]);
  }

  // Part 2 config
  const workersN = isTest ? 2 : 5;
  const workers = [...new Array(workersN)].map(() => ({
    goal: '',
    timeremaining: 0
  }));

  debug(workers);

  // Part 1 - Remove as the nodes become available, resolve multiples by pickin first alphaticall available
  const removedNodes: string[] = [];
  let iterations = 0;
  const getAvailableNodes = () => {
    const availableNodes: string[] = [];
    // Go through all unprocessed nodes
    for (const node of nodes) {
      const requiredNodes = (requirements.get(node) ?? []).filter(
        (required) => removedNodes.includes(required) == false
      );
      if (requiredNodes.length == 0) {
        availableNodes.push(node);
      }
    }
    return availableNodes.sort();
  };
  while (nodes.size > 0) {
    if (part == 1) {
      removedNodes.push(getAvailableNodes().shift()!);
      nodes.delete(removedNodes[removedNodes.length - 1]);
      continue;
    }

    // Iterate through workers -
    for (const worker of workers) {
      // Time ticks ticks away
      if (worker.timeremaining > 0) {
        worker.timeremaining = worker.timeremaining - 1;
      }
      // If time reaches zero while the goal is set - complete the task
      if (worker.timeremaining == 0 && worker.goal !== '') {
        removedNodes.push(worker.goal);
        nodes.delete(worker.goal);
        worker.goal = '';
      }
    }
    // Get next bit of work required
    const sortedAvailableNodesNotInProgress = getAvailableNodes().filter(
      (node) => workers.map(({ goal }) => goal).includes(node) == false
    );

    // Allocate work to available workers
    for (const worker of workers) {
      if (worker.goal == '' && sortedAvailableNodesNotInProgress.length > 0) {
        const next = sortedAvailableNodesNotInProgress.shift()!;
        const duration = next.charCodeAt(0) - 64 + (isTest ? 0 : 60);
        worker.goal = next;
        worker.timeremaining = duration;
      }
    }
    if (verbose) {
      debug(
        `${iterations} ${workers.map((w) => `${w.goal} (${w.timeremaining.toString().padStart(4, ' ')})`).join('    ')}`
      );
    }
    // if (workers.every((w) => w.timeremaining == 0) == false) {
    iterations++;
    // }
  }
  return part == 1 ? removedNodes.join('') : iterations - 1;
}).tests(
  `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`.split('\n'),
  'CABDFE',
  15
);
