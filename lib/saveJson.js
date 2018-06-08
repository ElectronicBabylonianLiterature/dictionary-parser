const fs = require('fs')

module.exports = function saveJson (dictionary, fileName) {
  return new Promise((resolve, reject) =>
    fs.writeFile(fileName, JSON.stringify(dictionary, null, '\t'), err => err ? reject(err) : resolve())
  )
}
