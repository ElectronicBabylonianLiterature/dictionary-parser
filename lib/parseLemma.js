const _ = require('lodash')

const expandAlternatives = require('./expandAlternatives')

module.exports = function parseLemma (string) {
  return _(expandAlternatives(string.replace(/\\/g, '')))
    .sortBy(_.size)
    .map(lemma => lemma.split(' '))
    .value()
}
