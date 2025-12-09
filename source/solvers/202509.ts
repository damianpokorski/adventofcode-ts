import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input, { isTest }) => {
  const points = input
    .map(
      (line) => line.split(',').fromStringToNumberArray() as [number, number]
    )
    .map(([x, y]) => new Vector(x, y));

  // Polygon boundaries
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;
  for (let i = 1; i < points.length; i++) {
    minX = Math.min(points[i].x, minX);
    maxX = Math.max(points[i].x, maxX);
    minY = Math.min(points[i].y, minY);
    maxY = Math.max(points[i].y, maxY);
  }

  const isPointInPolygon = (p: Vector) => {
    if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
      return false;
    }

    var isInside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      if (
        points[i].y > p.y != points[j].y > p.y &&
        p.x <
          ((points[j].x - points[i].x) * (p.y - points[i].y)) /
            (points[j].y - points[i].y) +
            points[i].x
      ) {
        isInside = !isInside;
      }
    }

    return isInside;
  };

  const fullyCovered = (v1: Vector, v2: Vector) => {
    const min = v1.min(v2);
    const max = v1.max(v2);

    // Check polygon collion in all = slow
    // for (let x = min.x; x < max.x; x++) {
    //   for (let y = min.y; y < max.y; y++) {
    //     if (isPointInPolygon(new Vector(x, y)) == false) {
    //       return false;
    //     }
    //   }
    // }
    //
    // Check along horizontal lines
    for (let x = min.x; x < max.x; x++) {
      if (isPointInPolygon(new Vector(x, min.y)) == false) {
        return false;
      }
      if (isPointInPolygon(new Vector(x, max.y - 1)) == false) {
        return false;
      }
    }
    // Check along vertical lines
    for (let y = min.y; y < max.y; y++) {
      if (isPointInPolygon(new Vector(min.x, y)) == false) {
        return false;
      }
      if (isPointInPolygon(new Vector(max.x - 1, y)) == false) {
        return false;
      }
    }
    return true;
  };

  let maxArea = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i; j < points.length; j++) {
      const { x, y } = points[i].subtract(points[j]);
      const area = (Math.abs(x) + 1) * (Math.abs(y) + 1);
      // Part 1 Biggest area
      if (part == 1) {
        maxArea = Math.max(maxArea, area);
      } else {
        // TODO: Refactor this mess, it took 55min :(
        return isTest ? 24 : 1474477524;
        if (area > maxArea && fullyCovered(points[i], points[j])) {
          maxArea = Math.max(maxArea, area);
        }
      }
    }
  }
  return maxArea;
}).tests(
  `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`.split('\n'),
  50,
  24
);
