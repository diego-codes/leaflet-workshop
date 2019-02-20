import { CENSUS_API_KEY } from '../common/secrets';
import fs from 'fs';
import path from 'path';
import _census from 'citysdk';

const variables = {
    "total": "B08301_001E",
    "car": "B08301_002E",
    "transit": "B08301_010E",
    "walk": "B08301_019E",
    "worked at home": "B08301_021E",
}

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
      // state: '*',
      // 'urban-area': '*'
      // 'region': '*',
      'metropolitan-statistical-area!micropolitan-statistical-area': '*',
      // 'place': '*',
    },
    sourcePath: ['acs', 'acs1'],
    values: [...Object.values(variables), 'B01003_001E'],
    statsKey: CENSUS_API_KEY,
    geoResolution: '500k',
  });

  writeFile(path.resolve(__dirname, '../tutorial/data.geo.json'), JSON.stringify(res, null, 2));
}

main().catch(handleErrors);