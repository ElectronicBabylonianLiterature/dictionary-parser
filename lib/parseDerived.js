const _ = require('lodash')
const parseWordArray = require('./parseWordArray')
const parseNotes = require('./parseNotes')
const defaultHomonym = 'I'

module.exports = function parseDerived (string) {
  function parse (element) {
    const derivedRegExp = /^(?:\*(cf.)\*)?\s*\*([^*]+)(?:\s|\*)*([IV.]+)?(.*)\s*$/
    const lemmaIndex = 2
    const homonymIndex = 3
    const notesIndices = [1, 4]

    const match = derivedRegExp.exec(element)
    return match
      ? {
        lemma: match[lemmaIndex],
        homonym: match[homonymIndex] || defaultHomonym,
        notes: parseNotes(notesIndices, match)
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
