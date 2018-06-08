const fs = require('fs')

module.exports = function readRows (fileName) {
  return new Promise((resolve, reject) =>
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.split('\n'))
      }
    })
  )
}
