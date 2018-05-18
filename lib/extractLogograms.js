const _ = require('lodash')

module.exports = function extractLogograms (string) {
  const logogramRegExp = /\\\[(.+?)\\\]/
  const match = logogramRegExp.exec(string)

  return match
    ? _(match[1])
      .split(';')
      .map(element => _(element)
        .split(' ')
        .map(_.trim)
        .reject(_.isEmpty)
        .value()
      ).value()
    : []
}
