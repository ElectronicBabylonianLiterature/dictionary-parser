const _ = require('lodash')

const dictionaryRowRegExp = /^\*\*(.+)\*\*(\s([IV]+))?(,.+)?\s(("|\(|\*\*\\~\*\*).*?)(\\>.+)?$/
const lemmaIndex = 1
const homonymIndex = 3
const formsIndex = 4
const definitionIndex = 5
const derivedIndex = 7

const defaultHomonym = 'I'
const defaultForms = []
const defaultDerived = ''

module.exports = class Entry {
  constructor (row) {
    this.source = row
    this.match = dictionaryRowRegExp.exec(row)
  }

  get lemma () {
    const rawLemma = this.match[lemmaIndex]
    return /^\*?(.+?)\*?$/.exec(rawLemma)[1].replace('\\*', '*')
  }

  get homonym () {
    return this.match[homonymIndex] || defaultHomonym
  }

  get forms () {
    const rawForms = this.match[formsIndex]
    return rawForms
      ? rawForms.split(',').map(form => _.trim(form, ' *')).filter(_.negate(_.isEmpty))
      : defaultForms
  }

  get definition () {
    return this.match[definitionIndex].trim()
  }

  get derived () {
    return this.match[derivedIndex] || defaultDerived
  }
}
