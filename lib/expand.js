const _ = require('lodash')

module.exports = function expand (string, regExp, replace) {
  const count = (string.match(regExp) || []).length

  return count === 0
    ? [string]
    : _.range(0, Math.pow(2, count)).map(selected => {
      let current = 1
      return string.replace(regExp, (match, ...groups) => replace(current++ & selected, ...groups))
    })
}
