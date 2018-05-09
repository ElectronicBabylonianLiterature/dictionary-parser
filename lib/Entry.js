const _ = require('lodash')

const dictionaryRowRegExp = /^\*\*(.+)\*\*(\s([IV]+))?(,.+)?\s(("|\(|\*\*\\~\*\*).*?)(\\>.+)?$/
const lemmaIndex = 1
const homonymIndex = 3
const formsIndex = 4
const definitionIndex = 5
const derivedIndex = 7

const defaultHomonym = 'I'
const defaultForms = []
const defaultDerived = []

function parseWordArray (string, trim) {
  return string.split(',')
    .map(element => _.trim(element, trim))
    .filter(_.negate(_.isEmpty))
}

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
      ? parseWordArray(rawForms, ' *')
      : defaultForms
  }

  get definition () {
    return this.match[definitionIndex].trim()
  }

  get derived () {
    const rawDerived = this.match[derivedIndex]
    return rawDerived
      ? parseWordArray(rawDerived, ' *\\>')
      : defaultDerived
  }
}
