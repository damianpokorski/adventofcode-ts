import '../utils';
import { Vector } from '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  const tiles = input.length < 500 ? { x: 11, y: 7 } : { x: 101, y: 103 };
  const robots = input
    .map((row) =>
      row.split(' ').map((v) => {
        const [x, y] = v
          .split('=')
          .pop()
          ?.split(',')
          .map((j) => parseInt(j)) ?? [0, 0];
        return new Vector(x, y);
      })
    )
    .map(([position, velocity]) => ({ position, velocity }));

  // Apply velocity 100x times
  for (let i = 0; i < (part == 1 ? 100 : 10000); i++) {
    for (const robot of robots) {
      // Apply velocity & handle overs
      robot.position.x = (robot.position.x + robot.velocity.x) % tiles.x;
      robot.position.y = (robot.position.y + robot.velocity.y) % tiles.y;
      // If we're entering negative territory - wrap around by number of tiles
      robot.position.x += robot.position.x < 0 ? tiles.x : 0;
      robot.position.y += robot.position.y < 0 ? tiles.y : 0;
    }

    // After lookin at text output - we can tell that xmas tree contains a row of 31 characters
    //  ......................................###############################................................
    //  ...........#..........................#.............................#................................
    //  ......................................#.............................#................................
    //  ......................................#.............................#..#....#........................
    // So we can just search for that
    if (part == 2) {
      if (
        Object.values(robots.groupBy((robot) => robot.position.y))
          .map((group) => group.map((r) => r.position.x).distinct())
          .filter((x) => x.length == 31).length > 0
      ) {
        return i + 1;
      }
    }
  }

  const quads = robots
    .filter(
      // Remov middle sections
      (robot) =>
        robot.position.x != Math.floor(tiles.x / 2) &&
        robot.position.y != Math.floor(tiles.y / 2)
    )
    .groupBy(
      // Split into quadrants
      (robot) =>
        `${Math.round(robot.position.x / tiles.x)}/${Math.round(robot.position.y / tiles.y)}`
    );

  return Object.values(quads)
    .map((q) => q.length)
    .reduce((a, b) => a * b, 1);
})
  .test(
    1,
    `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`.split('\n'),
    12
  )
  .test(
    2,
    `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`.split('\n'),
    20
  );
