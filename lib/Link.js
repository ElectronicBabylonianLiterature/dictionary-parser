const _ = require('lodash')

const parseWordArray = require('./parseWordArray')
const parseLemma = require('./parseLemma')
const parseDerived = require('../lib/parseDerived')

const linkRegExp = /^(?<lemma>(?:\*\*(?:\\\*|[^*])+\*\*(?:, )?)+) (?:etc\. )?\*cf\.\*(?<targets>[^<>[]+)$/

const dots = '...'

function headWithoutDots (lemma) {
  return _.head(lemma).slice(0, -dots.length)
}

function isDotLemma (lemma) {
  return _(lemma).head().endsWith(dots)
}

module.exports = class Link {
  static isLink (string) {
    return linkRegExp.test(string)
  }

  constructor (row) {
    this.source = row
    this.match = linkRegExp.exec(row)
    if (this.match) {
      this.lemmas = _.flatMap(parseWordArray(this.match.groups.lemma, ',', ' *'), parseLemma)
      this.targets = parseDerived(this.match.groups.targets)
    }
  }

  toDerivedForms () {
    return _(this.targets).flatten().flatMap(target => this.lemmas.map(lemma => {
      const isDotLink = isDotLemma(lemma)
      const entry = {
        key: _.pick(target, ['lemma', 'homonym']),
        isDotLink: isDotLink,
        value: {
          lemma: lemma,
          homonym: 'I',
          notes: target.notes,
          source: this.source
        }
      }
      if (isDotLink) {
        entry.lemmaWithoutDots = headWithoutDots(target.lemma)
        entry.value.lemmaWithoutDots = headWithoutDots(lemma)
      }
      return entry
    })).value()
  }
}
