const _ = require('lodash')

module.exports = function expandSlash (string) {
  const slashRegExp = /(.)\/(.)/g
  const count = (string.match(slashRegExp) || []).length

  return count === 0
    ? [string]
    : _.range(0, Math.pow(2, count)).map(selected => {
      let current = 1
      return string.replace(slashRegExp, (match, first, second) => (current++ & selected) ? second : first)
    })
}
