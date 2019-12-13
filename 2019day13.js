/*
--- Day 13: Care Package ---
As you ponder the solitude of space and the ever-increasing three-hour roundtrip for messages between you and Earth, you notice that the Space Mail Indicator Light is blinking. To help keep you sane, the Elves have sent you a care package.

It's a new game for the ship's arcade cabinet! Unfortunately, the arcade is all the way on the other end of the ship. Surely, it won't be hard to build your own - the care package even comes with schematics.

The arcade cabinet runs Intcode software like the game the Elves sent (your puzzle input). It has a primitive screen capable of drawing square tiles on a grid. The software draws tiles to the screen with output instructions: every three output instructions specify the x position (distance from the left), y position (distance from the top), and tile id. The tile id is interpreted as follows:

0 is an empty tile. No game object appears in this tile.
1 is a wall tile. Walls are indestructible barriers.
2 is a block tile. Blocks can be broken by the ball.
3 is a horizontal paddle tile. The paddle is indestructible.
4 is a ball tile. The ball moves diagonally and bounces off objects.
For example, a sequence of output values like 1,2,3,6,5,4 would draw a horizontal paddle tile (1 tile from the left and 2 tiles from the top) and a ball tile (6 tiles from the left and 5 tiles from the top).

Start the game. How many block tiles are on the screen when the game exits?
*/

const fs = require('fs');

let stdinBuffer = fs.readFileSync('./2019day13.txt');

// parse input
opcodes = stdinBuffer.toString().split(',');

opcodes = opcodes.map(code => parseInt(code));

const paint = Array(101).fill().map(v => Array(101).fill(0));

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

// program code (usually given), input array (reference), output array (reference), absolute start pointer, relative pointer (reference), stop opcode, debug mode
const mainV8 = (ops, stdin, stdout, start = 0, rel = [0], stop, debug = false) => {
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
      if (debug) console.log('Input:', ops[para3]);
      if (stop == 3) {
        return pos;
      }
    }
    else if (op == 4) {
      const para1 = paraParse(mode[2], ops, pos + 1, rel[0]);
      stdout.push(ops[para1]);
      if (debug) console.log('Output:', ops[para1]);
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

const final = mainV8(states, [], out, state, rel, 99);

let blocks = 0;

for (let i=0; i<out.length; i+=3) {
  const X = out[i];
  const Y = out[i+1];
  const T = out[i+2];

  if (T == 2) blocks++;
}

console.log(blocks);
