/*
--- Part Two ---
All this drifting around in space makes you wonder about the nature of the universe. Does history really repeat itself? You're curious whether the moons will ever return to a previous state.

Determine the number of steps that must occur before all of the moons' positions and velocities exactly match a previous point in time.

For example, the first example above takes 2772 steps before they exactly match a previous point in time; it eventually returns to the initial state:

After 0 steps:
pos=<x= -1, y=  0, z=  2>, vel=<x=  0, y=  0, z=  0>
pos=<x=  2, y=-10, z= -7>, vel=<x=  0, y=  0, z=  0>
pos=<x=  4, y= -8, z=  8>, vel=<x=  0, y=  0, z=  0>
pos=<x=  3, y=  5, z= -1>, vel=<x=  0, y=  0, z=  0>

After 2770 steps:
pos=<x=  2, y= -1, z=  1>, vel=<x= -3, y=  2, z=  2>
pos=<x=  3, y= -7, z= -4>, vel=<x=  2, y= -5, z= -6>
pos=<x=  1, y= -7, z=  5>, vel=<x=  0, y= -3, z=  6>
pos=<x=  2, y=  2, z=  0>, vel=<x=  1, y=  6, z= -2>

After 2771 steps:
pos=<x= -1, y=  0, z=  2>, vel=<x= -3, y=  1, z=  1>
pos=<x=  2, y=-10, z= -7>, vel=<x= -1, y= -3, z= -3>
pos=<x=  4, y= -8, z=  8>, vel=<x=  3, y= -1, z=  3>
pos=<x=  3, y=  5, z= -1>, vel=<x=  1, y=  3, z= -1>

After 2772 steps:
pos=<x= -1, y=  0, z=  2>, vel=<x=  0, y=  0, z=  0>
pos=<x=  2, y=-10, z= -7>, vel=<x=  0, y=  0, z=  0>
pos=<x=  4, y= -8, z=  8>, vel=<x=  0, y=  0, z=  0>
pos=<x=  3, y=  5, z= -1>, vel=<x=  0, y=  0, z=  0>
Of course, the universe might last for a very long time before repeating. Here's a copy of the second example from above:

<x=-8, y=-10, z=0>
<x=5, y=5, z=10>
<x=2, y=-7, z=3>
<x=9, y=-8, z=-3>
This set of initial positions takes 4686774924 steps before it repeats a previous state! Clearly, you might need to find a more efficient way to simulate the universe.

How many steps does it take to reach the first state that exactly matches a previous state?

*/

const fs = require('fs');

let stdinBuffer = fs.readFileSync('./2019day12.txt');

var Combinatorics = require('js-combinatorics');

const combo = Combinatorics.combination([0, 1, 2, 3], 2).toArray();

let moonsRaw = stdinBuffer.toString().split('\n');

let moons = [];

moonsRaw.forEach(moon => {
  const res = moon.match(/<x=([0-9\-]+), y=([0-9\-]+), z=([0-9\-]+)>/);
  const x = parseInt(res[1]);
  const y = parseInt(res[2]);
  const z = parseInt(res[3]);
  
  moons.push({
    pos: [x, y, z],
    velo: [0, 0, 0]
  });
});

const gravity = (X, Y) => {
  for (let i=0; i<3; i++) {
    if (X.pos[i] > Y.pos[i]) {
      X.velo[i]--;
      Y.velo[i]++;
    }
    else if (X.pos[i] < Y.pos[i]) {
      X.velo[i]++;
      Y.velo[i]--;
    }
    else if (X.pos[i] == Y.pos[i]) {
      continue;
    }
    else {
      console.log('???');
    }
  }
}

const velocity = (moon) => {
  for (let i=0; i<3; i++) {
    moon.pos[i] += moon.velo[i];
  }
}


const serialize = (index) => {
  let str = '';
  moons.forEach(moon => {
    str += moon.pos[index] + ',' + moon.velo[index];
    str += '\n';
  });

  return str;
}

let X = 0;
let Y = 0;
let Z = 0;

for (let i=0; i<3; i++) {
  const states = new Set();
  let counter = 0;
  states.add(serialize(i));

  while (true) {
    const txt = serialize(i);
    if (states.has(txt) && counter != 0) {
      break;
    }
    else {
      states.add(txt);
    }
  
    combo.forEach(com => {
      const A = moons[com[0]];
      const B = moons[com[1]];
  
      gravity(A, B);
    });
  
    moons.forEach(moon => {
      velocity(moon);
    });
  
    counter++;
  }

  if (i == 0) X = counter;
  else if (i == 1) Y = counter;
  else if (i == 2) Z = counter;
}

function gcd(a, b)
{ 
	return !b ? a : gcd(b, a % b);
} 

// Least Common Multiple function
function lcm(a, b) 
{
	return a * (b / gcd(a,b));
}

let lcm1 = lcm(X, Y);
console.log(lcm(lcm1, Z));