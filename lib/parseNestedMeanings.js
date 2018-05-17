const _ = require('lodash')

class Accumulator {
  constructor () {
    this.result = {}
    this.topLevelKey = null
    this.entryKey = null
  }

  startTopLevel (topLevelKey) {
    this.entryKey = null
    this.topLevelKey = topLevelKey
    this.result[topLevelKey] = {}
  }

  startEntry (entryKey) {
    if (!this.topLevelKey) {
      this.startTopLevel('implicit')
    }
    this.entryKey = entryKey
  }

  addMeaning (meaning) {
    this.result[this.topLevelKey][this.entryKey || 'meaning'] = meaning
    this.entryKey = null
  }
}

module.exports = function parseNestedMeanings (string) {
  return _(string.split('**')).map(candidate => _.trim(candidate, ' ;')).reject(_.isEmpty).reduce((accumulator, candidate) => {
    const conjugations = new RegExp(`^(${['G', 'Gtn', 'Gt', 'D', 'Dtn', 'Dt', 'Dtt', 'Š', 'Štn', 'Št', 'ŠD', 'N', 'Ntn', 'R'].map(_.escapeRegExp).join('|')})$`)
    const functions = /^[A-Z]\.$/
    const entires = /^\d\.$/

    if (conjugations.test(candidate) || functions.test(candidate)) {
      accumulator.startTopLevel(candidate)
    } else if (entires.test(candidate)) {
      accumulator.startEntry(candidate)
    } else {
      accumulator.addMeaning(candidate)
    }
    return accumulator
  }, new Accumulator()).result
}
