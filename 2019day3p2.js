/*
--- Part Two ---
It turns out that this circuit is very timing-sensitive; you actually need to minimize the signal delay.

To do this, calculate the number of steps each wire takes to reach each intersection; choose the intersection where the sum of both wires' steps is lowest. If a wire visits a position on the grid multiple times, use the steps value from the first time it visits that position when calculating the total value of a specific intersection.

The number of steps a wire takes is the total number of grid squares the wire has entered to get to that location, including the intersection being considered. Again consider the example from above:

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
In the above example, the intersection closest to the central port is reached after 8+5+5+2 = 20 steps by the first wire and 7+6+4+3 = 20 steps by the second wire for a total of 20+20 = 40 steps.

However, the top-right intersection is better: the first wire takes only 8+5+2 = 15 and the second wire takes only 7+6+2 = 15, a total of 15+15 = 30 steps.

Here are the best steps for the extra examples from above:

R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83 = 610 steps
R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7 = 410 steps
What is the fewest combined steps the wires must take to reach an intersection?
*/

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

const findShorts = (p1, p2) => {
  // minor optimisations
  const p1l = p1.length;
  const p2l = p2.length;

  const shorts = [];

  for (let i=0; i<p1l; i++) {
    for (let j=0; j<p2l; j++) {
      if (p1[i][0] == p2[j][0] && p1[i][1] == p2[j][1]) {
        shorts.push(i + j);
      }
    }
  }

  return shorts;
}

// main loop

for (let i=0; i<route1.length; i++) {
  performOp(route1[i], r1);
}

for (let i=0; i<route2.length; i++) {
  performOp(route2[i], r2);
}

const short = findShorts(r1, r2);

console.log('Time taken: ' + (Date.now() - now) / 1000 + ' seconds');
console.log('Distances:', short);

const shortest = short.slice(1); // remove the 0
console.log('Shortest:', Math.min(...shortest));
