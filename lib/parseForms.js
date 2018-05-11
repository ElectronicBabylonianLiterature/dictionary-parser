const parseWordArray = require('./parseWordArray')

module.exports = function parseForms (string) {
  return parseWordArray(string, ',', ' *')
}
