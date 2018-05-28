const _ = require('lodash')
const expand = require('./expand')

module.exports = function expandAlternatives (string, ignore = null) {
  const alternativesRegExp = _.isString(ignore) ? new RegExp(`\\((?!${_.escapeRegExp(ignore)})([^()]+)\\)`, 'g') : /\(([^()]+)\)/g
  return expand(string, alternativesRegExp, (isSelected, characters) => isSelected ? characters : '')
}
