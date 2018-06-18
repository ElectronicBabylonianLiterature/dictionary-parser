const _ = require('lodash')
const extractVowels = require('./extractVowels')

class Accumulator {
  constructor () {
    this.result = {}
    this.topLevelKey = null
    this.entryKey = null
  }

  static isTopLevel (candidate) {
    const conjugations = new RegExp(`^(${['G', 'Gtn', 'Gt', 'D', 'Dtn', 'Dt', 'Dtt', 'Š', 'Štn', 'Št', 'ŠD', 'N', 'Ntn', 'R', 'Št2'].map(_.escapeRegExp).join('|')})$`)
    const functions = /^[A-Z]\.$/

    return conjugations.test(candidate) || functions.test(candidate)
  }

  static isEntry (candidate) {
    const entires = /^\d+\.$/

    return entires.test(candidate)
  }

  static createEntry () {
    return {
      meaning: '',
      vowels: []
    }
  }

  startTopLevel (topLevelKey) {
    this.entryKey = null
    this.topLevelKey = topLevelKey
    this.result[topLevelKey] = Accumulator.createEntry()
  }

  startEntry (entryKey) {
    if (!this.topLevelKey) {
      this.startTopLevel('implicit')
    }
    this.entryKey = entryKey
    this.result[this.topLevelKey][entryKey] = Accumulator.createEntry()
  }

  addMeaning (meaning) {
    const entry = _.isNil(this.entryKey) ? this.result[this.topLevelKey] : this.result[this.topLevelKey][this.entryKey]
    entry.meaning = meaning
    entry.vowels = extractVowels(meaning)

    this.entryKey = null
  }

  visit (candidate) {
    if (Accumulator.isTopLevel(candidate)) {
      this.startTopLevel(candidate)
    } else if (Accumulator.isEntry(candidate)) {
      this.startEntry(candidate)
    } else {
      this.addMeaning(candidate)
    }

    return this
  }
}

module.exports = function parseNestedMeanings (string) {
  return _(string.split('**'))
    .map(candidate => _.trim(candidate, ' ;'))
    .reject(_.isEmpty)
    .reduce((accumulator, candidate) => accumulator.visit(candidate), new Accumulator())
    .result
}
