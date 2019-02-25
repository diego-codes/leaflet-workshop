import { CENSUS_API_KEY } from '../common/secrets'
import fs from 'fs'
import _census from 'citysdk'

const variables = {
  B08301_001E: "total",
  B08301_010E: "public_transportation",
  B08301_003E: "drove_alone",
  B08301_018E: "bicycle",
  B08301_019E: "walked",
  B08301_016E: "taxicab",
  B08301_017E: "motorcycle",
}

/**
 * Generic Promise handler factory for Node-style callbacks
 * @param {function} resolve resolve Promise method
 * @param {function} reject reject Promise method
 */
const nodeCallback = (resolve, reject) => (err, res) => {
  if (err) reject(err)
  resolve(res)
}

/**
 * Census CitySDK wrapped in a Promise for async/await operations
 * @param {object} options CitySDK options object
 */
const census = options => {
  return new Promise((resolve, reject) => {
    _census(options, nodeCallback(resolve, reject))
  })
}

/**
 * File system Node module write file method wrapped in a Promise for async/await operations
 * @param {string} file path of file to write to
 * @param {string} data data to write to file
 * @param {object} options additional options
 */
const writeFile = (file, data, options) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, options || nodeCallback(resolve, reject))
  })
}

/**
 * Main function to run
 */
const main = async () => {
  try {
    const data = await census({
      vintage: 2017,
      geoHierarchy: {
        'metropolitan-statistical-area!micropolitan-statistical-area': '*',
      },
      sourcePath: ['acs', 'acs1'],
      values: Object.keys(variables),
      statsKey: CENSUS_API_KEY,
      geoResolution: '500k',
    })


    data.features = data.features.map(feature =>
      ({
        ...feature,
        properties: Object.entries(variables)
          .reduce((stats, [variable, label]) => {
            const value = feature.properties[variable]
            if (variable === 'B08301_001E') return { ...stats, [label]: value }

            return {
              ...stats,
              [label]: {
                estimate: value,
                percent: value / stats.total,
              },
            }
          }, {
              name: feature.properties.NAME,
            }),
      })
    )

    data.properties = Object.values(variables).reduce((stats, label) => {
      if (label === 'total') {
        const totals = data.features.map(feature => feature.properties[label])

        return {
          ...stats,
          [label]: {
            min: Math.min(...totals),
            max: Math.max(...totals),
          },
        }
      }

      const estimates = data.features.map(feature => feature.properties[label].estimate)
      const percents = data.features.map(feature => feature.properties[label].percent)

      return {
        ...stats,
        [label]: {
          estimate: {
            min: Math.min(...estimates),
            max: Math.max(...estimates),
          },
          percent: {
            min: Math.min(...percents),
            max: Math.max(...percents),
          },
        },
      }
    }, {})

    console.log(data.properties)
    console.log(data.features[0].properties)
    console.log(`${data.features.length} records created`)

    writeFile('./data.geo.json', JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()