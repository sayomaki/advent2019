/*
--- Part Two ---
You're not sure what it's trying to paint, but it's definitely not a registration identifier. The Space Police are getting impatient.

Checking your external ship cameras again, you notice a white panel marked "emergency hull painting robot starting panel". The rest of the panels are still black, but it looks like the robot was expecting to start on a white panel, not a black one.

Based on the Space Law Space Brochure that the Space Police attached to one of your windows, a valid registration identifier is always eight capital letters. After starting the robot on a single white panel instead, what registration identifier does it paint on your hull?

*/

const fs = require('fs');

let stdinBuffer = fs.readFileSync('./2019day11.txt');

// parse input
opcodes = stdinBuffer.toString().split(',');

opcodes = opcodes.map(code => parseInt(code));

// The hull
let paint = Array(101).fill().map(v => Array(101).fill(0));

let center = [50, 50];

paint[center[1]][center[0]] = 1;

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

let vec = [0, -1];

let rel = [0];

state = mainV7(states, [paint[center[1]][center[0]]], out, state, rel, 4);

while (!Number.isNaN(state)) {
  const color = out[out.length - 1];
  if (color == 0) {
    paint[center[1]][center[0]] = 0;
  }
  else if (color == 1) {
    paint[center[1]][center[0]] = 1;
  }
  else {
    console.log('?');
  }
  
  state = mainV7(states, [], out, state, rel, 4);
  const dir = out[out.length - 1];

  // this seems inefficient and too long
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

  state = mainV7(states, [paint[center[1]][center[0]]], out, state, rel, 4);
}

// print grid
let output = '';
paint.forEach(h => {
  h.forEach(w => {
    if (w == '1') output += '░';
    if (w == '0') output += '█';
  });
  output += '\n';
});
console.log(output);