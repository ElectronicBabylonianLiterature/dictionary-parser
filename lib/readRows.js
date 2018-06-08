const fs = require('fs')
const _ = require('lodash')

module.exports = function readRows (fileName) {
  return new Promise((resolve, reject) =>
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(_(data).split('\n').map(_.trim).reject(_.isEmpty).value())
      }
    })
  )
}
