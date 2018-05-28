const _ = require('lodash')
const parseNotes = require('./parseNotes')

module.exports = function extractVowels (meaning) {
  const vowelRegExp = /\((?<vowels>(?:(:?.+ )?\*[a-z]\/[a-z]\*(?:, )?)+(?:; [^)]+)?)\)/
  const match = vowelRegExp.exec(meaning)
  return _.has(match, 'groups.vowels')
    ? _(match.groups.vowels)
      .split(/(?:(?<=\/[a-z]\*), |;)/g)
      .map(element => {
        const match = /(?<note>.+ )?\*(?<first>[a-z])\/(?<second>[a-z])\*/.exec(element)
        return _.isObject(match)
          ? {
            value: [match.groups.first, match.groups.second],
            notes: parseNotes(['note'], match.groups)
          }
          : {
            value: [],
            notes: [element.trim()]
          }
      })
      .value()
    : []
}
