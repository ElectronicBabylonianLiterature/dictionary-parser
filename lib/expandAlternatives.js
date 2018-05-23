const _ = require('lodash')

module.exports = function expandAlternatives (string, ignore = null) {
  const alternativesRegExp = _.isString(ignore) ? new RegExp(`\\((?!${_.escapeRegExp(ignore)})([^()]+)\\)`, 'g') : /\(([^()]+)\)/g
  const count = (string.match(alternativesRegExp) || []).length

  return count === 0
    ? [string]
    : _.range(0, Math.pow(2, count)).map(selected => {
      let current = 1
      return string.replace(alternativesRegExp, (match, characters) => (current++ & selected) ? characters : '')
    })
}
