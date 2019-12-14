/*
--- Part Two ---
After collecting ORE for a while, you check your cargo hold: 1 trillion (1000000000000) units of ORE.

With that much ore, given the examples above:

The 13312 ORE-per-FUEL example could produce 82892753 FUEL.
The 180697 ORE-per-FUEL example could produce 5586022 FUEL.
The 2210736 ORE-per-FUEL example could produce 460664 FUEL.
Given 1 trillion ORE, what is the maximum amount of FUEL you can produce?
*/

/* 
  ================================================= 
        WARNING: REALLY INEFFICIENT CODE!!!
          ESTIMATED TIME TO RUN: 25mins
  ================================================= 
*/


const fs = require('fs');

let stdinBuffer = fs.readFileSync('./2019day14.txt');

let formulas = stdinBuffer.toString().split('\n');

const recipes = {}

formulas.forEach(form => {
  const eq = form.split(' => ');
  const inputs = eq[0].split(', ');
  const output = eq[1];

  let indict = [];
  inputs.forEach(input => {
    indict.push([parseInt(input.split(' ')[0]), input.split(' ')[1]]);
  });

  const mat = output.split(' ')[1];
  const amt = parseInt(output.split(' ')[0]);

  recipes[mat] = {
    amt,
    formula: indict
  }
});

let avail = 1000000000000;

const fuelformula = recipes['FUEL'];

let required = {}

fuelformula.formula.forEach(form => {
  required[form[1]] = form[0];
});

const getMaterials = () => {
  return Object.keys(required).filter(mat => required[mat] > 0);
}

let mats = getMaterials();

let used = 0;

let count = 0;

while (used <= avail) {
  while (mats.length > 1) {
    mats.forEach(mat => {
      if (mat == 'ORE') return;
      const recp = recipes[mat];
  
      const times = Math.ceil((required[mat] / recp.amt));
      const amt = recp.amt * times;
  
      required[mat] -= amt;
  
      for (let i=0; i<times; i++) {
        recp.formula.forEach(form => {
          if (required.hasOwnProperty(form[1])) {
            required[form[1]] += form[0];
          }
          else required[form[1]] = form[0];
        });
      }
    });

    mats = getMaterials();
  }

  // console.log(required['ORE']);
  if (required['ORE'] > avail) break;

  used = required['ORE'];
  
  fuelformula.formula.forEach(form => {
    required[form[1]] += form[0];
  });
  mats = getMaterials();

  count++;
  if (count % 50000 == 0) console.log(count);
}

console.log(count);
