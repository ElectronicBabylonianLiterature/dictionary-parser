const _ = require('lodash')

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
    const entires = /^\d\.$/

    return entires.test(candidate)
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

  extractVowels (meaning) {
    const vowelRegExp = /\(((?:\*[a-z]\/[a-z]\*(?:, )?)+)\)/
    const vowels = vowelRegExp.exec(meaning)
    return _.isArrayLike(vowels)
      ? _(vowels)
        .tail()
        .split(', ')
        .map(element => _.trim(element, '*'))
        .map(element => _.split(element, '/'))
        .value()
      : []
  }

  addMeaning (meaning) {
    this.result[this.topLevelKey][this.entryKey || 'meaning'] = meaning

    const vowels = this.extractVowels(meaning)
    if (_.isNil(this.entryKey) && !_.isEmpty(vowels)) {
      this.result[this.topLevelKey].vowels = vowels
    }

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
