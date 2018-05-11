const _ = require('lodash')

module.exports = function parseWordArray (string, separator, trim) {
  return _(string.split(separator))
    .map(element => _.trim(element, trim))
    .compact()
    .value()
}
