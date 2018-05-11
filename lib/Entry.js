const parseWordArray = require('./parseWordArray')
const parseDerived = require('./parseDerived')

const dictionaryRowRegExp = /^\*\*(.+?)(?:\\~)?\*\*(\s([IV]+))?(,.+?)?\s(("|'|\(|\*\*\\~\*\*).*?)(\\>.+?)?(?:\\<\s*\*(.+?)\*)?$/
const lemmaIndex = 1
const homonymIndex = 3
const formsIndex = 4
const definitionIndex = 5
const derivedIndex = 7
const derivedFromIndex = 8

const defaultHomonym = 'I'
const defaultForms = []
const defaultDerived = []
const defaultDerivedFrom = null

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
      ? parseWordArray(rawForms, ',', ' *')
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

  get derivedFrom () {
    return this.match[derivedFromIndex] || defaultDerivedFrom
  }
}
