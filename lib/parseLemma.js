const _ = require('lodash')

const expandAlternatives = require('./expandAlternatives')

module.exports = function parseLemma (string) {
  return _(expandAlternatives(string.replace(/\\/g, '')))
    .flatMap(lemma => lemma.endsWith('um')
      ? [lemma.slice(0, -1), lemma]
      : lemma)
    .sortBy(_.size)
    .map(lemma => lemma.split(' '))
    .value()
}
