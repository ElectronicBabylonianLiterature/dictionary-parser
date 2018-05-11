const _ = require('lodash')
const parseWordArray = require('./parseWordArray')

module.exports = function parseForms (string) {
  const trim = ' *'
  return _(parseWordArray(string, ';', trim)).flatMap(element => parseWordArray(element, ',', trim)).value()
}
