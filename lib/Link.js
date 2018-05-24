const _ = require('lodash')

const parseWordArray = require('./parseWordArray')
const parseLemma = require('./parseLemma')
const parseDerived = require('../lib/parseDerived')

const linkRegExp = /^(?<lemma>(?:\*\*(?:\\\*|[^*])+\*\*(?:, )?)+) (?:etc\. )?\*cf\.\*(?<targets>[^<>[]+)$/

module.exports = class Link {
  static isLink (string) {
    return linkRegExp.test(string)
  }

  constructor (row) {
    this.source = row
    this.match = linkRegExp.exec(row)
  }

  get lemmas () {
    return _.flatMap(parseWordArray(this.match.groups.lemma, ',', ' *'), parseLemma)
  }

  get targets () {
    return parseDerived(this.match.groups.targets)
  }

  toDerivedForms () {
    return _(this.targets).flatten().flatMap(target => this.lemmas.map(lemma => {
      const entry = {
        key: _.pick(target, ['lemma', 'homonym']),
        value: {
          lemma: lemma,
          homonym: 'I',
          notes: target.notes,
          source: this.source
        }
      }
      return entry
    })).value()
  }
}
