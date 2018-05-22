const _ = require('lodash')

module.exports = function expandMimation (string) {
  const mimationRegExp = /\(([^()]+)\)/g
  const count = (string.match(mimationRegExp) || []).length

  return count === 0
    ? [string]
    : _.range(0, Math.pow(2, count)).map(selected => {
      let current = 1
      return string.replace(mimationRegExp, (match, characters) => (current++ & selected) ? characters : '')
    })
}
