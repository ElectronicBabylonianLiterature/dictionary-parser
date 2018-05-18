const _ = require('lodash')

module.exports = function extractLogograms (string) {
  const logogramRegExp = /\\\[(?<logograms>.+?)\\\]/
  const match = logogramRegExp.exec(string)

  return match
    ? _(match.groups.logograms)
      .split(';')
      .map(element => _(element)
        .split(/(?<!\.) /)
        .map(_.trim)
        .reject(_.isEmpty)
        .value()
      ).value()
    : []
}
