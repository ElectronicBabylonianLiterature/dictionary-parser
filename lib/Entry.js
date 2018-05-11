const parseWordArray = require('./parseWordArray')
const parseDerived = require('./parseDerived')

const dictionaryRowRegExp = /^\*\*(.+?)(?:\\~)?\*\*(\s([IV]+))?(,.+?)?\s(("|'|\(|\*\*\\~\*\*).*?)((?:\\>|\\<).+?)?$/
const lemmaIndex = 1
const homonymIndex = 3
const formsIndex = 4
const definitionIndex = 5
const derivedIndex = 7

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
    const rawMatch = this.match[derivedIndex] || ''
    const derivedRegExp = /(?:\\<[^>]*)?\\>([^\\]+);?\s*(?:\\<)?/
    const derivedMatch = derivedRegExp.exec(rawMatch)
    const rawDerived = derivedMatch ? derivedMatch[1] : null
    return rawDerived
      ? parseDerived(rawDerived)
      : defaultDerived
  }

  get derivedFrom () {
    const rawMatch = this.match[derivedIndex] || ''
    const derivedFromRegExp = /(?:\\>[^<]*)?\\<\s*\*([^\\]+)\*;?\s*(?:\\>)?/
    const derivedFromMatch = derivedFromRegExp.exec(rawMatch)
    const derivedFrom = derivedFromMatch ? derivedFromMatch[1] : null
    return derivedFrom || defaultDerivedFrom
  }
}
