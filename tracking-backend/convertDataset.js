import fs from 'fs';
import streamChain from 'stream-chain';
import streamJson from 'stream-json';
import StreamArrayModule from 'stream-json/streamers/StreamArray.js';

const { chain } = streamChain;
const { parser } = streamJson;

// streamArray is a constructor, so we call it with "new"
const StreamArray = StreamArrayModule.default ?? StreamArrayModule;

const pipeline = chain([
  fs.createReadStream('FilteredDataHuman.json'),
  parser(),
  new StreamArray()  // ✅ THIS is the fix
]);

const output = fs.createWriteStream('data.json');
output.write('[\n');

let first = true;

pipeline.on('data', ({ value }) => {
  const cleaned = {
    timestamp: Number(value.timestamp?.$date?.$numberLong),
    instances: Object.entries(value.instances || {}).reduce((acc, [key, val]) => {
      acc[key] = {
        pos_x: val.pos_x,
        pos_y: val.pos_y,
        vel_x: val.vel_x,
        vel_y: val.vel_y,
        confidence: val.confidence,
        sensors: val.sensors,
      };
      return acc;
    }, {})
  };

  if (!first) output.write(',\n');
  output.write(JSON.stringify(cleaned, null, 2));
  first = false;
});

pipeline.on('end', () => {
  output.write('\n]');
  output.end();
  console.log('✅ Done converting and saving to data.json');
});
