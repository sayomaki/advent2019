/*
--- Part Two ---
Once you give them the coordinates, the Elves quickly deploy an Instant Monitoring Station to the location and discover the worst: there are simply too many asteroids.

The only solution is complete vaporization by giant laser.

Fortunately, in addition to an asteroid scanner, the new monitoring station also comes equipped with a giant rotating laser perfect for vaporizing asteroids. The laser starts by pointing up and always rotates clockwise, vaporizing any asteroid it hits.

If multiple asteroids are exactly in line with the station, the laser only has enough power to vaporize one of them before continuing its rotation. In other words, the same asteroids that can be detected can be vaporized, but if vaporizing one asteroid makes another one detectable, the newly-detected asteroid won't be vaporized until the laser has returned to the same position by rotating a full 360 degrees.

For example, consider the following map, where the asteroid with the new monitoring station (and laser) is marked X:

.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....X...###..
..#.#.....#....##
The first nine asteroids to get vaporized, in order, would be:

.#....###24...#..
##...##.13#67..9#
##...#...5.8####.
..#.....X...###..
..#.#.....#....##
Note that some asteroids (the ones behind the asteroids marked 1, 5, and 7) won't have a chance to be vaporized until the next full rotation. The laser continues rotating; the next nine to be vaporized are:

.#....###.....#..
##...##...#.....#
##...#......1234.
..#.....X...5##..
..#.9.....8....76
The next nine to be vaporized are then:

.8....###.....#..
56...9#...#.....#
34...7...........
..2.....X....##..
..1..............
Finally, the laser completes its first full rotation (1 through 3), a second rotation (4 through 8), and vaporizes the last asteroid (9) partway through its third rotation:

......234.....6..
......1...5.....7
.................
........X....89..
.................
In the large example above (the one with the best monitoring station location at 11,13):

The 1st asteroid to be vaporized is at 11,12.
The 2nd asteroid to be vaporized is at 12,1.
The 3rd asteroid to be vaporized is at 12,2.
The 10th asteroid to be vaporized is at 12,8.
The 20th asteroid to be vaporized is at 16,0.
The 50th asteroid to be vaporized is at 16,9.
The 100th asteroid to be vaporized is at 10,16.
The 199th asteroid to be vaporized is at 9,6.
The 200th asteroid to be vaporized is at 8,2.
The 201st asteroid to be vaporized is at 10,9.
The 299th and final asteroid to be vaporized is at 11,1.
The Elves are placing bets on which will be the 200th asteroid to be vaporized. Win the bet by determining which asteroid that will be; what do you get if you multiply its X coordinate by 100 and then add its Y coordinate? (For example, 8,2 becomes 802.)
*/

const fs = require('fs');

let stdinBuffer = fs.readFileSync('./2019day10.txt');

const dist = require('vectors/dist')(2)
const heading = require('vectors/heading')(2)

let astro = [];

let rows = stdinBuffer.toString().split('\n');

rows.forEach((row, h) => {
  Array.from(row).forEach((space, w) => {
    if (space == '#') {
      astro.push([w, h]);
    }
  });
});

// heading map of asteroids
const view = {};

let ast = [20, 20]; // found from Part 1

astro.forEach(compare => {
  // ignore lazer position
  if (ast[0] == compare[0] && ast[1] == compare[1]) return;

  const dir = heading(ast, compare);
  const dis = dist(ast, compare);

  let deg = dir * 180 / Math.PI;

  // heading function starts from left clockwise, we want start from up clockwise (-90 deg relative)
  deg -= 90;

  // make heading positive 0 <= deg <= 360
  if (deg < 0) deg += 360;
  if (deg >= 360) deg %= 360;

  if (view.hasOwnProperty(deg)) {
    view[deg].push([compare, dis]);
  }
  else {
    view[deg] = [[compare, dis]];
  }
});

const lazerOrder = Object.keys(view).sort((a, b) => {
  a = parseFloat(a);
  b = parseFloat(b);

  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
});

const order = [];

// # of asteriods that needs to be destroyed
let len = astro.length - 1;

while (len > 0) {
  lazerOrder.forEach(ang => {
    // sort asteroids in same line by distance (hits nearest first, others view blocked)
    view[ang] = view[ang].sort((a, b) => {
      a = a[1]
      b = b[1]
    
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
  
    // no more in that line
    if (view[ang].length < 1) return;

    const out = view[ang].splice(0, 1);
    order.push(out[0]);
    len--;
  });
}

// 200th asteriod -> array index 199 (1st asteriod -> array index 0)
// console.log(order[199]);
console.log(order[199][0][0] * 100 + order[199][0][1]);
