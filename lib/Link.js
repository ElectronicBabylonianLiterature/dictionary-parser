const parseLemma = require('./parseLemma')

const linkRegExp = /^(?:\*\*(?<lemma>(?:\\\*|[^*])+)\*\*(?:, | )?)+\s(?:etc\. )?\*cf\.\*?/

module.exports = class Link {
  static isLink (string) {
    return linkRegExp.test(string)
  }

  constructor (row) {
    this.source = row
    this.match = linkRegExp.exec(row)
  }

  get lemmas () {
    return parseLemma(this.match.groups.lemma)
  }
}
