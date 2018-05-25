const _ = require('lodash')

const expandParentheses = require('./expandParentheses')

module.exports = function parseLemma (string) {
  return _(expandParentheses(string.replace(/\\/g, '')))
    .flatMap(lemma => lemma.endsWith('um')
      ? [lemma.slice(0, -1), lemma]
      : lemma)
    .sortBy(_.size)
    .map(lemma => lemma.split(' '))
    .value()
}
