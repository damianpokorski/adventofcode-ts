import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, opts) => {
  // Map input into tuples of 3
  type Vector3 = [number, number, number];
  const boxes = input.map((line) => line.split(',').asNumbers() as Vector3);

  // 3d distance calc
  const distance = ([[a1, a2, a3], [b1, b2, b3]]: [Vector3, Vector3]) =>
    (a1 - b1) ** 2 + (a2 - b2) ** 2 + (a3 - b3) ** 2;

  // Hashmap data building
  const distanceToPair = new Map<number, [string, string, Vector3, Vector3]>();
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const value = distance([boxes[i], boxes[j]]);
      distanceToPair.set(value, [
        boxes[i].join(','),
        boxes[j].join(','),
        boxes[i],
        boxes[j]
      ]);
    }
  }

  // Sort keys (distance) - shortest first
  const shortest = [...distanceToPair.keys()]
    .sort((a, b) => a - b)
    .map((distance) => distanceToPair.get(distance)!);

  // Create connections & group them
  const connections = [] as string[][];
  for (let i = 0; i < shortest.length; i++) {
    const [a, b, vectorA, vectorB] = shortest[i];
    const circuitA = connections.findIndex((circuit) => circuit.includes(a));
    const circuitB = connections.findIndex((circuit) => circuit.includes(b));

    // Merge two circuits when cross connection is detected connection into first one, drop second one
    if (circuitA !== -1 && circuitB !== -1 && circuitA !== circuitB) {
      connections[circuitA] = [
        ...connections[circuitA],
        ...connections[circuitB]
      ];
      connections.splice(circuitB, 1);
    }

    const existingCircuitIndex = connections.findIndex(
      (circuit) => circuit.includes(a) || circuit.includes(b)
    );

    // Create new circuit if we're not part of existing entry
    if (existingCircuitIndex == -1) {
      connections.push([a, b]);
    } else {
      // Only add connections if both are not in the circuit already
      if (
        (connections[existingCircuitIndex].includes(a) &&
          connections[existingCircuitIndex].includes(b)) == false
      ) {
        // Connect the missing node to existing circuit
        connections[existingCircuitIndex].push(
          connections[existingCircuitIndex].includes(a) ? b : a
        );
      }
    }

    // Part 1 - 1000 connections
    if (part == 1 && i >= (opts.isTest ? 10 : 1000) - 1) {
      break;
    }
    // Part 2 - Keep connecting until it's all 1 big circuit
    if (part == 2 && connections[0].length == input.length) {
      return vectorA[0] * vectorB[0];
    }
  }

  // Pick last 3 and return
  return connections
    .map((x) => x.length)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b, 1);
}).tests(
  `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`.split('\n'),
  40,
  25272
);
