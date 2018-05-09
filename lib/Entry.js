const dictionaryRowRegExp = /^\*\*(.+)\*\*(\s([IV]+))?(,.+)?\s(("|\(|\*\*\\~\*\*).*)/
const lemmaIndex = 1
const homonymIndex = 3
const formsIndex = 4
const definitionIndex = 5

const defaultHomonym = 'I'
const defaultForms = ''

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
    return this.match[formsIndex] || defaultForms
  }

  get definition () {
    return this.match[definitionIndex]
  }
}
