import { CENSUS_API_KEY } from '../common/secrets';
import fs from 'fs';
import path from 'path';
import _census from 'citysdk';

const values = [
  'B08301_001E',
  'B08301_010E',
  'B08301_003E',
  'B08301_018E',
  'B08301_019E',
  'B08301_016E',
  'B08301_017E',
];

const handleErrors = err => {
  console.error(err);
  process.exit(1);
}

const nodeCallback = (resolve, reject) => (err, res) => {
  if (err) reject(err);
  resolve(res);
}

const census = (opts) => {
  return new Promise((resolve, reject) => {
    _census(opts, nodeCallback(resolve, reject))
  });
}

const writeFile = (file, data, options) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, options || nodeCallback(resolve, reject))
  })
}

async function main() {

  const res = await census({
    vintage: 2017,
    geoHierarchy: {
      // 'combined-statistical-area': '*',
      'metropolitan-statistical-area!micropolitan-statistical-area': '*',
    },
    sourcePath: ['acs', 'acs1'],
    values,
    
    statsKey: CENSUS_API_KEY,
    geoResolution: '500k',
  });
  console.log(`${res.features.length} records created`);
  writeFile(path.resolve(__dirname, '../tutorial/data.geo.json'), JSON.stringify(res, null, 2));
}

main().catch(handleErrors);