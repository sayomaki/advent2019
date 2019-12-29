/*
--- Day 24: Planet of Discord ---
You land on Eris, your last stop before reaching Santa. As soon as you do, your sensors start picking up strange life forms moving around: Eris is infested with bugs! With an over 24-hour roundtrip for messages between you and Earth, you'll have to deal with this problem on your own.

Eris isn't a very large place; a scan of the entire area fits into a 5x5 grid (your puzzle input). The scan shows bugs (#) and empty spaces (.).

Each minute, The bugs live and die based on the number of bugs in the four adjacent tiles:

A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
Otherwise, a bug or empty space remains the same. (Tiles on the edges of the grid have fewer than four adjacent tiles; the missing tiles count as empty space.) This process happens in every location simultaneously; that is, within the same minute, the number of adjacent bugs is counted for every tile first, and then the tiles are updated.

Here are the first few minutes of an example scenario:

Initial state:
....#
#..#.
#..##
..#..
#....

After 1 minute:
#..#.
####.
###.#
##.##
.##..

After 2 minutes:
#####
....#
....#
...#.
#.###

After 3 minutes:
#....
####.
...##
#.##.
.##.#

After 4 minutes:
####.
....#
##..#
.....
##...
To understand the nature of the bugs, watch for the first time a layout of bugs and empty spaces matches any previous layout. In the example above, the first layout to appear twice is:

.....
.....
.....
#....
.#...
To calculate the biodiversity rating for this layout, consider each tile left-to-right in the top row, then left-to-right in the second row, and so on. Each of these tiles is worth biodiversity points equal to increasing powers of two: 1, 2, 4, 8, 16, 32, and so on. Add up the biodiversity points for tiles with bugs; in this example, the 16th tile (32768 points) and 22nd tile (2097152 points) have bugs, a total biodiversity rating of 2129920.

What is the biodiversity rating for the first layout that appears twice?
*/

const fs = require('fs');

let stdinBuffer = fs.readFileSync('./2019day24.txt');

const data = stdinBuffer.toString().split('\n');

let planet = Array(5).fill().map((v, i) => Array.from(data[i]));

const countAdjacent = (p, x, y) => {
  let count = 0;
  if (x > 0 && p[y][x - 1] == '#') count++;
  if (x < 4 && p[y][x + 1] == '#') count++;
  if (y > 0 && p[y - 1][x] == '#') count++;
  if (y < 4 && p[y + 1][x] == '#') count++;
  return count;
}

const isBug = (p, x, y) => {
  return p[y][x] == '#';
}

const rulesOfSurvival = (p) => {
  const adjacent = Array(5).fill().map(v => Array(5).fill(0));
  for (let i=0; i<5; i++) {
    for (let j=0; j<5; j++) {
      adjacent[i][j] = countAdjacent(p, j, i);
    }
  }

  for (let i=0; i<5; i++) {
    for (let j=0; j<5; j++) {
      if (isBug(p, j, i) && adjacent[i][j] != 1) {
        p[i][j] = '.'; // bug ded
      }
      else if (adjacent[i][j] == 2 || adjacent[i][j] == 1) {
        p[i][j] = '#'; // hooray new bug
      }
    }
  }
}

const getLayoutHash = (p) => {
  let layout = '';
  planet.forEach(h => {
    h.forEach(w => {
      layout += w;
    });
  });
  return layout;
}

const layoutSet = new Set();

while (true) {
  const hash = getLayoutHash(planet);

  if (layoutSet.has(hash)) break;
  else layoutSet.add(hash);

  rulesOfSurvival(planet);
}

const calcBiodiversityRating = (planet) => {
  let list = [];
  planet.forEach((h, i) => {
    h.forEach((w, j) => {
      if (w == '#') list.push(j + (i * 5));
    });
  });
  list = list.map(v => Math.pow(2, v));
  return list.reduce((a, c) => a + c);
}

console.log(calcBiodiversityRating(planet));