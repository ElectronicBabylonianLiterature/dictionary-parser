const _ = require('lodash')
const Papa = require('papaparse')
const fs = require('fs')

module.exports = function parseCsv (fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        Papa.parse(data, {
          complete: results => _.isEmpty(results.errors)
            ? resolve(results.data)
            : reject(results.errors),
          error: error => reject(error)
        })
      }
    })
  })
}
