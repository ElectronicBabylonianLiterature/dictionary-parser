const _ = require('lodash')

const dictionaryRowRegExp = /^\*\*(.+?)(?:\\~)?\*\*(\s([IV]+))?(,.+?)?\s(("|\(|\*\*\\~\*\*).*?)(\\>.+)?$/
const lemmaIndex = 1
const homonymIndex = 3
const formsIndex = 4
const definitionIndex = 5
const derivedIndex = 7

const defaultHomonym = 'I'
const defaultForms = []
const defaultDerived = []

function parseSubArray (string, separator, trim) {
  return string.split(separator)
    .map(element => _.trim(element, trim))
    .filter(_.negate(_.isEmpty))
}

function parseWordArray (string, trim) {
  return parseSubArray(string, ',', trim)
}

function parseDerived (string) {
  const derivedRegExp = /^\*([^*]+)(?:\s|\*)*([IV.]+)?(.*)\s*$/
  return parseSubArray(string, ';', ' \\>')
    .filter(_.negate(_.isEmpty))
    .map(element => _.flatten(parseWordArray(element, ' ').map(element => {
      const match = derivedRegExp.exec(element)
      return match
        ? {lemma: match[1], homonym: match[2] || null, notes: match[3] || ''}
        : element
    }).map(derived => {
      return _.isString(derived.homonym)
        ? derived.homonym.split('.').map(homonym => ({...derived, homonym: homonym}))
        : derived
    })))
}

module.exports = class Entry {
  constructor (row) {
    this.source = row
    this.match = dictionaryRowRegExp.exec(row)
  }

  get lemma () {
    const rawLemma = this.match[lemmaIndex]
    return /^\*?(.+?)(\s+|\*)?$/.exec(rawLemma)[1].replace('\\*', '*')
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
      ? parseDerived(rawDerived)
      : defaultDerived
  }
}
