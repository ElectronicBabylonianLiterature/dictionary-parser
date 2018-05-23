const _ = require('lodash')

const parseWordArray = require('./parseWordArray')
const parseLemma = require('./parseLemma')

const linkRegExp = /^(?<lemma>(?:\*\*(?:\\\*|[^*])+\*\*(?:, )?)+) (?:etc\. )?\*cf\.\*?/

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
}
