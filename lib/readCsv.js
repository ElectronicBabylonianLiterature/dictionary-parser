const _ = require('lodash')
const Papa = require('papaparse')
const fs = require('fs')

function parse (data, resolve, reject) {
  Papa.parse(data, {
    complete: results => _.isEmpty(results.errors)
      ? resolve(results.data)
      : reject(results.errors),
    error: error => reject(error)
  })
}

module.exports = function readCsv (fileName) {
  return new Promise((resolve, reject) =>
    fs.readFile(fileName, 'utf8', (err, data) =>
      err ? reject(err) : parse(data, resolve, reject)))
}
