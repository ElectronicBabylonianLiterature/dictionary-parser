const _ = require('lodash')

const dictionaryRowRegExp = /^\*\*(.+?)(?:\\~)?\*\*(\s([IV]+))?(,.+?)?\s(("|'|\(|\*\*\\~\*\*).*?)(\\>.+)?$/
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
  function parse (element) {
    const derivedRegExp = /^(?:\*(cf.)\*)?\s*\*([^*]+)(?:\s|\*)*([IV.]+)?(.*)\s*$/
    const lemmaIndex = 2
    const homonymIndex = 3
    const notesIndices = [1, 4]

    const match = derivedRegExp.exec(element)
    return match
      ? {
        lemma: match[lemmaIndex],
        homonym: match[homonymIndex] || null,
        notes: notesIndices.map(i => match[i]).filter(_.isString).join(' ').trim()
      }
      : element
  }

  function splitByHomonym (derived) {
    return _.isString(derived.homonym)
      ? derived.homonym.split('.').map(homonym => ({ ...derived, homonym: homonym }))
      : derived
  }

  return parseSubArray(string, ';', ' \\>')
    .map(element => _(parseWordArray(element, ' '))
      .map(parse)
      .flatMap(splitByHomonym)
      .value())
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
