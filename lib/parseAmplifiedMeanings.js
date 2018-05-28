const _ = require('lodash')
const parseNotes = require('./parseNotes')

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
    const vowelRegExp = /\((?<vowels>(?:(:?.+ )?\*[a-z]\/[a-z]\*(?:, )?)+)\)/
    const match = vowelRegExp.exec(meaning)
    return _.has(match, 'groups.vowels')
      ? _(match.groups.vowels)
        .split(/(?<=\/[a-z]\*), /g)
        .map(element => /(?<note>.+ )?\*(?<first>[a-z])\/(?<second>[a-z])\*/.exec(element).groups)
        .map(groups => ({
          value: [groups.first, groups.second],
          notes: parseNotes(['note'], groups)
        }))
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
