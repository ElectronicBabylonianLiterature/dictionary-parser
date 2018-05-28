const _ = require('lodash')

const expandParentheses = require('./expandParentheses')
const expandSlash = require('./expandSlash')

module.exports = function parseLemma (string) {
  return _(expandParentheses(string.replace(/\\/g, '')))
    .flatMap(expandSlash)
    .flatMap(lemma => lemma.endsWith('um')
      ? [lemma.slice(0, -1), lemma]
      : lemma)
    .sortBy(_.size)
    .map(lemma => lemma.split(' '))
    .value()
}
