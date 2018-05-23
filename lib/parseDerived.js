const _ = require('lodash')
const parseWordArray = require('./parseWordArray')
const parseNotes = require('./parseNotes')
const defaultHomonym = 'I'

module.exports = function parseDerived (string) {
  function parse (element) {
    const derivedRegExp = /^(?<preNote>.+?\s+)?\*(?<lemma>[^*]+)(?:\s|\*)*(?<homonym>[IV.]+)?(?<postNote>.*)\s*$/
    const notesIndices = ['preNote', 'postNote']

    const match = derivedRegExp.exec(element)
    return match
      ? {
        lemma: match.groups.lemma,
        homonym: match.groups.homonym || defaultHomonym,
        notes: parseNotes(notesIndices, match.groups)
      }
      : element
  }

  function splitByHomonym (derived) {
    return _.isString(derived.homonym)
      ? derived.homonym.split('.').map(homonym => ({ ...derived, homonym: homonym }))
      : derived
  }

  return parseWordArray(string, ';', ' \\>')
    .map(element => _(parseWordArray(element, ',', ' '))
      .map(parse)
      .flatMap(splitByHomonym)
      .value())
}
