/*
--- Part Two ---
The game didn't run because you didn't put in any quarters. Unfortunately, you did not bring any quarters. Memory address 0 represents the number of quarters that have been inserted; set it to 2 to play for free.

The arcade cabinet has a joystick that can move left and right. The software reads the position of the joystick with input instructions:

If the joystick is in the neutral position, provide 0.
If the joystick is tilted to the left, provide -1.
If the joystick is tilted to the right, provide 1.
The arcade cabinet also has a segment display capable of showing a single number that represents the player's current score. When three output instructions specify X=-1, Y=0, the third output instruction is not a tile; the value instead specifies the new score to show in the segment display. For example, a sequence of output values like -1,0,12345 would show 12345 as the player's current score.

Beat the game by breaking all the blocks. What is your score after the last block is broken?
*/

const fs = require('fs');

let stdinBuffer = fs.readFileSync('./2019day13.txt');

// parse input
opcodes = stdinBuffer.toString().split(',');

opcodes = opcodes.map(code => parseInt(code));

const grid = Array(23).fill().map(v => Array(37).fill(0));

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
      if (stop == 3 && stdin.length == 0) {
        return pos;
      }
      const para3 = paraParse(mode[2], ops, pos + 1, rel[0]);
      ops[para3] = stdin.shift();
      pos += 2;
      if (debug) console.log('Input:', ops[para3]);
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
states[0] = 2;
const out = [];

let state = 0;
let rel = [0];

state = mainV8(states, [], out, state, rel, 3);
let lastOut = out.length;

let score = 0;

let paddle = [];
let ball = [];

for (let i=0; i<lastOut; i+=3) {
  const X = out[i];
  const Y = out[i+1];
  const T = out[i+2];

  if (X == -1 && Y == 0) {
    score = T;
  }
  else {
    grid[Y][X] = T;

    if (T == 3) {
      paddle = [X, Y];
    }
    else if (T == 4) {
      ball = [X, Y];
    }
  }
}

let input = 0;

const calcInput = () => {
  if (ball[0] > paddle[0]) return 1;
  else if (ball[0] < paddle[0]) return -1;
  else return 0;
}

while (!Number.isNaN(state)) {
  input = calcInput();
  state = mainV8(states, [input], out, state, rel, 3);

  for (let i=lastOut; i<out.length; i+=3) {
    const X = out[i];
    const Y = out[i+1];
    const T = out[i+2];

    if (X == -1 && Y == 0) {
      score = T;
    }
    else {
      grid[Y][X] = T;
  
      if (T == 3) {
        paddle = [X, Y];
      }
      else if (T == 4) {
        ball = [X, Y];
      }
    }
  }

  lastOut = out.length;
}

console.log(score);
