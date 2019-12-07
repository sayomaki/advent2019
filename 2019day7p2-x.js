
// console.log('[CHILD] Child mode, please run with >2 args for master');

// global vars
let opcodes = [];

const fs = require('fs');

const stdinBuffer = fs.readFileSync('./2019day7.txt');

// parse input
opcodes = stdinBuffer.toString().split(',');

opcodes = opcodes.map(code => parseInt(code));

let res;

let input = new Promise((resolve, rej) => {
  res = resolve;
});

const mainV5 = async (ops, stdin, stdout) => {
  let pos = 0;

  let mode = [];
  let op = 0;

  let inst = ops[0];
  mode = [Math.floor(inst/10000), Math.floor((inst%10000)/1000), Math.floor((inst%1000)/100)];

  op = inst % 100;

  while ((op > 0 && op < 9) && op != 99) {
    if (op == 1) {
      const para1 = mode[2] == 1 ? ops[pos + 1] : ops[ops[pos + 1]];
      const para2 = mode[1] == 1 ? ops[pos + 2] : ops[ops[pos + 2]];
      const sum = para1 + para2;
      ops[ops[pos + 3]] = sum;
      pos += 4;
    }
    else if (op == 2) {
      const para1 = mode[2] == 1 ? ops[pos + 1] : ops[ops[pos + 1]];
      const para2 = mode[1] == 1 ? ops[pos + 2] : ops[ops[pos + 2]];
      const mul = para1 * para2;
      ops[ops[pos + 3]] = mul;
      pos += 4;
    }
    else if (op == 3) {
      // console.log('Waiting input...');
      ops[ops[pos + 1]] = await input;
      input = new Promise((resolve, reject) => {res = resolve;});
      pos += 2;
    }
    else if (op == 4) {
      const para1 = mode[2] == 1 ? ops[pos + 1] : ops[ops[pos + 1]];
      // console.log('Output:', para1);
      process.send(para1);
      pos += 2;
    }
    else if (op == 5) {
      // jump-if-true
      const para1 = mode[2] == 1 ? ops[pos + 1] : ops[ops[pos + 1]];
      const para2 = mode[1] == 1 ? ops[pos + 2] : ops[ops[pos + 2]];
      if (para1 != 0) {
        pos = para2;
      }
      else {
        pos += 3;
      }
    }
    else if (op == 6) {
      // jump-if-false
      const para1 = mode[2] == 1 ? ops[pos + 1] : ops[ops[pos + 1]];
      const para2 = mode[1] == 1 ? ops[pos + 2] : ops[ops[pos + 2]];
      if (para1 == 0) {
        pos = para2;
      }
      else {
        pos += 3;
      }
    }
    else if (op == 7) {
      // less-than
      const para1 = mode[2] == 1 ? ops[pos + 1] : ops[ops[pos + 1]];
      const para2 = mode[1] == 1 ? ops[pos + 2] : ops[ops[pos + 2]];
      if (para1 < para2) {
        ops[ops[pos + 3]] = 1
      }
      else {
        ops[ops[pos + 3]] = 0;
      }
      pos += 4;
    }
    else if (op == 8) {
      // equals
      const para1 = mode[2] == 1 ? ops[pos + 1] : ops[ops[pos + 1]];
      const para2 = mode[1] == 1 ? ops[pos + 2] : ops[ops[pos + 2]];
      if (para1 == para2) {
        ops[ops[pos + 3]] = 1
      }
      else {
        ops[ops[pos + 3]] = 0;
      }
      pos += 4;
    }

    inst = ops[pos];
    mode = [Math.floor(inst/10000), Math.floor((inst%10000)/1000), Math.floor((inst%1000)/100)];
    op = inst % 100;

    // console.log('(debug) next:', op, mode);
  }

  process.send('NaN');
}

mainV5(opcodes);

process.on('message', (msg) => {
  msg = parseInt(msg.toString());
  res(msg);
});
