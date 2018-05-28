const expand = require('./expand')

module.exports = function expandSlash (string) {
  const slashRegExp = /(.)\/(.)/g
  return expand(string, slashRegExp, (isSelected, first, second) => isSelected ? second : first)
}
