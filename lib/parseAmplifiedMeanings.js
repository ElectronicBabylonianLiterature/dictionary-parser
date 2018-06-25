const _ = require('lodash')
const extractVowels = require('./extractVowels')

class Accumulator {
  constructor () {
    this.result = []
    this.topLevelIndex = null
    this.entryIndex = null
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

  static createTopLevelEntry (key) {
    return {
      ...Accumulator.createEntry(),
      key: key,
      entries: []
    }
  }

  startTopLevel (topLevelKey) {
    this.entryIndex = null
    this.topLevelIndex = this.result.length
    this.result[this.topLevelIndex] = Accumulator.createTopLevelEntry(topLevelKey)
  }

  startEntry (entryKey) {
    if (_.isNil(this.topLevelIndex)) {
      this.startTopLevel('')
    }
    this.entryIndex = this.result[this.topLevelIndex].entries.length
    this.result[this.topLevelIndex].entries[this.entryIndex] = Accumulator.createEntry()
  }

  addMeaning (meaning) {
    const entry = _.isNil(this.entryIndex) ? this.result[this.topLevelIndex] : this.result[this.topLevelIndex].entries[this.entryIndex]
    entry.meaning = meaning
    entry.vowels = extractVowels(meaning)

    this.entryIndex = null
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
