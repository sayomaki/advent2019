/*
--- Part Two ---
Now you're ready to decode the image. The image is rendered by stacking the layers and aligning the pixels with the same positions in each layer. The digits indicate the color of the corresponding pixel: 0 is black, 1 is white, and 2 is transparent.

The layers are rendered with the first layer in front and the last layer in back. So, if a given position has a transparent pixel in the first and second layers, a black pixel in the third layer, and a white pixel in the fourth layer, the final image would have a black pixel at that position.

For example, given an image 2 pixels wide and 2 pixels tall, the image data 0222112222120000 corresponds to the following image layers:

Layer 1: 02
         22

Layer 2: 11
         22

Layer 3: 22
         12

Layer 4: 00
         00
Then, the full image can be found by determining the top visible pixel in each position:

The top-left pixel is black because the top layer is 0.
The top-right pixel is white because the top layer is 2 (transparent), but the second layer is 1.
The bottom-left pixel is white because the top two layers are 2, but the third layer is 1.
The bottom-right pixel is black because the only visible pixel in that position is 0 (from layer 4).
So, the final image looks like this:

01
10
What message is produced after decoding your image?
*/

const fs = require('fs');
let stdinBuffer = fs.readFileSync('./2019day8.txt');

let imgdata = stdinBuffer.toString();

const layerC = imgdata.length / (25 * 6);

let layers = [];

for (let i=0; i<layerC; i++) {
  layers.push(imgdata.substr(i * 25 * 6, 25 * 6));
}

const final = Array(6).fill().map(v => Array(25).fill('2'));

// Original implementation (too long imo)
/* const final = [];
for (let i=0; i<6; i++) {
  const arr = [];
  for (let i=0; i<25; i++) {
    arr.push('2');
  }
  final.push(arr)
} */

layers.forEach((layer) => {
  Array.from(layer).forEach((pix, index) => {
    const w = index % 25;
    const h = Math.floor(index / 25);

    if (pix == '0') {
      if (final[h][w] == '2') {
        final[h][w] = '0';
      }
    }
    else if (pix == '1') {
      if (final[h][w] == '2') {
        final[h][w] = '1';
      }
    }
  });
});

let out = '';
final.forEach(h => {
  h.forEach(w => {
    if (w == '1') out += 'X';
    if (w == '0') out += '.';
    if (w == '2') out += ' ';
  });
  out += '\n';
});
console.log(out);

