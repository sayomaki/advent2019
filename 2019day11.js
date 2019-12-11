/*
--- Day 11: Space Police ---
On the way to Jupiter, you're pulled over by the Space Police.

"Attention, unmarked spacecraft! You are in violation of Space Law! All spacecraft must have a clearly visible registration identifier! You have 24 hours to comply or be sent to Space Jail!"

Not wanting to be sent to Space Jail, you radio back to the Elves on Earth for help. Although it takes almost three hours for their reply signal to reach you, they send instructions for how to power up the emergency hull painting robot and even provide a small Intcode program (your puzzle input) that will cause it to paint your ship appropriately.

There's just one problem: you don't have an emergency hull painting robot.

You'll need to build a new emergency hull painting robot. The robot needs to be able to move around on the grid of square panels on the side of your ship, detect the color of its current panel, and paint its current panel black or white. (All of the panels are currently black.)

The Intcode program will serve as the brain of the robot. The program uses input instructions to access the robot's camera: provide 0 if the robot is over a black panel or 1 if the robot is over a white panel. Then, the program will output two values:

First, it will output a value indicating the color to paint the panel the robot is over: 0 means to paint the panel black, and 1 means to paint the panel white.
Second, it will output a value indicating the direction the robot should turn: 0 means it should turn left 90 degrees, and 1 means it should turn right 90 degrees.
After the robot turns, it should always move forward exactly one panel. The robot starts facing up.

The robot will continue running for a while like this and halt when it is finished drawing. Do not restart the Intcode computer inside the robot during this process.

For example, suppose the robot is about to start running. Drawing black panels as ., white panels as #, and the robot pointing the direction it is facing (< ^ > v), the initial state and region near the robot looks like this:

.....
.....
..^..
.....
.....
The panel under the robot (not visible here because a ^ is shown instead) is also black, and so any input instructions at this point should be provided 0. Suppose the robot eventually outputs 1 (paint white) and then 0 (turn left). After taking these actions and moving forward one panel, the region now looks like this:

.....
.....
.<#..
.....
.....
Input instructions should still be provided 0. Next, the robot might output 0 (paint black) and then 0 (turn left):

.....
.....
..#..
.v...
.....
After more outputs (1,0, 1,0):

.....
.....
..^..
.##..
.....
The robot is now back where it started, but because it is now on a white panel, input instructions should be provided 1. After several more outputs (0,1, 1,0, 1,0), the area looks like this:

.....
..<#.
...#.
.##..
.....
Before you deploy the robot, you should probably have an estimate of the area it will cover: specifically, you need to know the number of panels it paints at least once, regardless of color. In the example above, the robot painted 6 panels at least once. (It painted its starting panel twice, but that panel is still only counted once; it also never painted the panel it ended on.)

Build a new emergency hull painting robot and run the Intcode program on it. How many panels does it paint at least once?
*/

const fs = require('fs');

let stdinBuffer = fs.readFileSync('./2019day11.txt');

// parse input
opcodes = stdinBuffer.toString().split(',');

opcodes = opcodes.map(code => parseInt(code));

const paint = Array(1001).fill().map(v => Array(1001).fill(0));

let center = [500, 500];

// returns absolute position of operation parameter
const paraParse = (mode, ops, pos, rel) => {
  if (mode == 1) {
    return pos;
  }
  else if (mode == 0) {
    return ops[pos];
  }
  else if (mode == 2) {
    return rel + ops[pos];
  }
  else {
    console.log('??')
  }
}

// program code (usually given), input array (reference), output array (reference), absolute start pointer, relative pointer (reference), stop opcode
const mainV7 = (ops, stdin, stdout, start = 0, rel = [0], stop) => {
  let counter = 0;
  let pos = start;

  let mode = [];
  let op = 0;

  let inst = ops[pos];
  mode = [Math.floor(inst/10000), Math.floor((inst%10000)/1000), Math.floor((inst%1000)/100)];

  op = inst % 100;

  while ((op > 0 && op < 10) && op != 99) {
    if (op == 1) {
      const para1 = paraParse(mode[2], ops, pos + 1, rel[0]);
      const para2 = paraParse(mode[1], ops, pos + 2, rel[0]);
      const para3 = paraParse(mode[0], ops, pos + 3, rel[0]);
      const sum = ops[para1] + ops[para2];
      ops[para3] = sum;
      pos += 4;
    }
    else if (op == 2) {
      const para1 = paraParse(mode[2], ops, pos + 1, rel[0]);
      const para2 = paraParse(mode[1], ops, pos + 2, rel[0]);
      const para3 = paraParse(mode[0], ops, pos + 3, rel[0]);
      const mul = ops[para1] * ops[para2];
      ops[para3] = mul;
      pos += 4;
    }
    else if (op == 3) {
      const para3 = paraParse(mode[2], ops, pos + 1, rel[0]);
      ops[para3] = stdin[counter];
      counter++;
      pos += 2;
      console.log('Input:', ops[para3]);
      if (stop == 3) {
        return pos;
      }
    }
    else if (op == 4) {
      const para1 = paraParse(mode[2], ops, pos + 1, rel[0]);
      stdout.push(ops[para1]);
      console.log('Output:', ops[para1]);
      pos += 2;
      if (stop == 4) {
        return pos;
      }
    }
    else if (op == 5) {
      // jump-if-true
      const para1 = paraParse(mode[2], ops, pos + 1, rel[0]);
      const para2 = paraParse(mode[1], ops, pos + 2, rel[0]);
      if (ops[para1] != 0) {
        pos = ops[para2];
      }
      else {
        pos += 3;
      }
    }
    else if (op == 6) {
      // jump-if-false
      const para1 = paraParse(mode[2], ops, pos + 1, rel[0]);
      const para2 = paraParse(mode[1], ops, pos + 2, rel[0]);
      if (ops[para1] == 0) {
        pos = ops[para2];
      }
      else {
        pos += 3;
      }
    }
    else if (op == 7) {
      // less-than
      const para1 = paraParse(mode[2], ops, pos + 1, rel[0]);
      const para2 = paraParse(mode[1], ops, pos + 2, rel[0]);
      const para3 = paraParse(mode[0], ops, pos + 3, rel[0]);
      if (ops[para1] < ops[para2]) {
        ops[para3] = 1
      }
      else {
        ops[para3] = 0;
      }
      pos += 4;
    }
    else if (op == 8) {
      // equals
      const para1 = paraParse(mode[2], ops, pos + 1, rel[0]);
      const para2 = paraParse(mode[1], ops, pos + 2, rel[0]);
      const para3 = paraParse(mode[0], ops, pos + 3, rel[0]);
      if (ops[para1] == ops[para2]) {
        ops[para3] = 1
      }
      else {
        ops[para3] = 0;
      }
      pos += 4;
    }
    else if (op == 9) {
      // relative set offset
      const para1 = paraParse(mode[2], ops, pos + 1, rel[0]);
      rel[0] += ops[para1];
      pos += 2;
    }

    inst = ops[pos];
    mode = [Math.floor(inst/10000), Math.floor((inst%10000)/1000), Math.floor((inst%1000)/100)];
    op = inst % 100;
  }

  return NaN;
}

const states = [...opcodes];
const out = [];

let state = 0;
let rel = [0];

let vec = [0, -1];

const tiles = new Set();

while (!Number.isNaN(state)) {
  state = mainV7(states, [paint[center[0]][center[1]]], out, state, rel, 4);
  const color = out[out.length - 1];
  if (color == 0) {
    paint[center[0]][center[1]] = 0;
  }
  else if (color == 1) {
    paint[center[0]][center[1]] = 1;
  }
  else {
    console.log('?');
  }

  // append tile position to set
  tiles.add(`${center[0]},${center[1]}`);
  
  state = mainV7(states, [], out, state, rel, 4);
  const dir = out[out.length - 1];

  if (dir == 0) {
    if (vec[0] == 0 && vec[1] == -1) {
      vec = [-1, 0];
    }
    else if (vec[0] == -1 && vec[1] == 0) {
      vec = [0, 1];
    }
    else if (vec[0] == 0 && vec[1] == 1) {
      vec = [1, 0];
    }
    else if (vec[0] == 1 && vec[1] == 0) {
      vec = [0, -1];
    }
  }
  else if (dir == 1) {
    if (vec[0] == 0 && vec[1] == -1) {
      vec = [1, 0];
    }
    else if (vec[0] == 1 && vec[1] == 0) {
      vec = [0, 1];
    }
    else if (vec[0] == 0 && vec[1] == 1) {
      vec = [-1, 0];
    }
    else if (vec[0] == -1 && vec[1] == 0) {
      vec = [0, -1];
    }
  }
  else {
    console.log('???', dir);
  }

  center[0] += vec[0];
  center[1] += vec[1];
}

console.log(tiles.size);
