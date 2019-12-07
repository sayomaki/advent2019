/*
--- Day 4: Secure Container ---
You arrive at the Venus fuel depot only to discover it's protected by a password. The Elves had written the password on a sticky note, but someone threw it out.

However, they do remember a few key facts about the password:

It is a six-digit number.
The value is within the range given in your puzzle input.
Two adjacent digits are the same (like 22 in 122345).
Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
Other than the range rule, the following are true:

111111 meets these criteria (double 11, never decreases).
223450 does not meet these criteria (decreasing pair of digits 50).
123789 does not meet these criteria (no double).
How many different passwords within the range given in your puzzle input meet these criteria?
*/

const fs = require('fs');

const stdinBuffer = fs.readFileSync('./2019day4.txt');

const input = stdinBuffer.toString();

// range parse and convert to integer

const min = parseInt(input.split('-')[0]);
const max = parseInt(input.split('-')[1]);

let counter = 0;

const checkDouble = (arr) => {
  const map = {};
  arr.forEach(digit => {
    if (map.hasOwnProperty(digit)) map[digit] += 1;
    else map[digit] = 1;
  });

  const res = Object.values(map).filter(val => val > 1);
  return res.length > 0;
}

const checkIncreasing = (arr) => {
  let prev = -1;
  arr = arr.map(a => parseInt(a));

  for (let i=0; i<arr.length; i++) {
    if (i == 0) prev = arr[i];
    
    if (arr[i] < prev) return false;
    prev = arr[i];
  }
  return true;
}

for (let i=min; i<max; i++) {
  const str = i.toString();
  const arr = Array.from(str);
  if (!checkDouble(arr)) continue;
  if (!checkIncreasing(arr)) continue;
  counter++;
}

console.log('Part 1:', counter);

/*
--- Part Two ---
An Elf just remembered one more important detail: the two adjacent matching digits are not part of a larger group of matching digits.

Given this additional criterion, but still ignoring the range rule, the following are now true:

112233 meets these criteria because the digits never decrease and all repeated digits are exactly two digits long.
123444 no longer meets the criteria (the repeated 44 is part of a larger group of 444).
111122 meets the criteria (even though 1 is repeated more than twice, it still contains a double 22).
How many different passwords within the range given in your puzzle input meet all of the criteria?
*/

let counter2 = 0;

const checkDoubleStrict = (arr) => {
  const map = {};
  arr.forEach(digit => {
    if (map.hasOwnProperty(digit)) map[digit] += 1;
    else map[digit] = 1;
  });

  const res = Object.values(map).filter(val => val == 2);
  return res.length > 0;
}

for (let i=min; i<max; i++) {
  const str = i.toString();
  const arr = Array.from(str);
  if (!checkDoubleStrict(arr)) continue;
  if (!checkIncreasing(arr)) continue;
  counter2++;
}

console.log('Part 2:', counter2);