const _ = require('lodash')

const expandParentheses = require('./expandParentheses')
const expandSlash = require('./expandSlash')

module.exports = function parseLemma (string) {
  function expandUm (string) {
    return string.endsWith('um')
      ? [string.slice(0, -1), string]
      : [string]
  }

  return _(string.replace(/\\/g, ''))
    .thru(expandUm)
    .flatMap(expandParentheses)
    .flatMap(expandSlash)
    .sortBy(_.size)
    .map(lemma => lemma.split(' '))
    .value()
}
