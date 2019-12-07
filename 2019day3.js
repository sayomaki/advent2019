/* 
--- Day 3: Crossed Wires ---
The gravity assist was successful, and you're well on your way to the Venus refuelling station. During the rush back on Earth, the fuel management system wasn't completely installed, so that's next on the priority list.

Opening the front panel reveals a jumble of wires. Specifically, two wires are connected to a central port and extend outward on a grid. You trace the path each wire takes as it leaves the central port, one wire per line of text (your puzzle input).

The wires twist and turn, but the two wires occasionally cross paths. To fix the circuit, you need to find the intersection point closest to the central port. Because the wires are on a grid, use the Manhattan distance for this measurement. While the wires do technically cross right at the central port where they both start, this point does not count, nor does a wire count as crossing with itself.

For example, if the first wire's path is R8,U5,L5,D3, then starting from the central port (o), it goes right 8, up 5, left 5, and finally down 3:

...........
...........
...........
....+----+.
....|....|.
....|....|.
....|....|.
.........|.
.o-------+.
...........
Then, if the second wire's path is U7,R6,D4,L4, it goes up 7, right 6, down 4, and left 4:

...........
.+-----+...
.|.....|...
.|..+--X-+.
.|..|..|.|.
.|.-X--+.|.
.|..|....|.
.|.......|.
.o-------+.
...........
These wires cross at two locations (marked X), but the lower-left one is closer to the central port: its distance is 3 + 3 = 6.
*/

// =============================================
//      DISCLAIMER: VERY INEFFICIENT CODE!!
// =============================================

// Global vars
let route1 = [];
let route2 = [];

// init pos for both routes
let r1 = [[0, 0]];
let r2 = [[0, 0]];

// // optimise
// let r1 = new Set([[0, 0]]);
// let r2 = new Set([[0, 0]]);

const fs = require('fs');
const now = Date.now();

const parseInput = (input) => {
  const split = input.split('\n');
  route1 = split[0].split(',');
  route2 = split[1].split(',');
}

const stdinBuffer = fs.readFileSync('./2019day3.txt');
parseInput(stdinBuffer.toString());

const performOp = (op, r) => {
  const dir = op[0];
  const dist = parseInt(op.substr(1));

  if (dir == 'U') {
    for (let i=0; i<dist; i++) {
      r.push([
          r[r.length - 1][0], 
          r[r.length - 1][1] + 1
        ]);
    }
  }
  else if (dir == 'D') {
    for (let i=0; i<dist; i++) {
      r.push([
          r[r.length - 1][0], 
          r[r.length - 1][1] - 1
        ]);
    }
  }
  else if (dir == 'L') {
    for (let i=0; i<dist; i++) {
      r.push([
          r[r.length - 1][0] - 1, 
          r[r.length - 1][1]
        ]);
    }
  }
  else {
    for (let i=0; i<dist; i++) {
      r.push([
          r[r.length - 1][0] + 1, 
          r[r.length - 1][1]
        ]);
    }
  }
}

const common = (p1, p2) => {
  const final = [];
  
  p1.forEach(v1 => {
    p2.forEach(v2 => {
      if (v1[0] == v2[0] && v1[1] == v2[1]) final.push(v1);
    });
  });


  return final;
}

const minPoint = (pts) => {
  let min = Number.MAX_SAFE_INTEGER;

  for (let i=0; i<pts.length; i++) {
    if (pts[i][0] == 0 && pts[i][1] == 0) continue;

    const dist = Math.abs(pts[i][0]) + Math.abs(pts[i][1]);
    if (dist < min) {
      min = dist;
    }
  }

  return min;
}

// main loop

for (let i=0; i<route1.length; i++) {
  performOp(route1[i], r1);
}

for (let i=0; i<route2.length; i++) {
  performOp(route2[i], r2);
}

const out = common(r1, r2);

const min = minPoint(out);

console.log('Time taken:' + (Date.now() - now) / 1000 + 'seconds');
console.log('Common:', out);
console.log('Dist:', min);