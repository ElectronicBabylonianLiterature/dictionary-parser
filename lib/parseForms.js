const _ = require('lodash')
const parseWordArray = require('./parseWordArray')
const parseNotes = require('./parseNotes')
const expandAlternatives = require('./expandAlternatives')

module.exports = function parseForms (string) {
  function parse (element) {
    const formRegExp = /^(?:(?<preNote>.+)\s)?(?:\\(?<star>\*))?\*(?<lemma>.+)\*\s*(?<postNote>.+)?$/
    const notesIndices = ['preNote', 'postNote']

    const match = formRegExp.exec(element)
    return match
      ? expandAlternatives(`${match.groups.star || ''}${match.groups.lemma}`).map(lemma => ({
        lemma: lemma.split(' '),
        notes: parseNotes(notesIndices, match.groups)
      }))
      : element
  }

  const trim = ' '
  return _(parseWordArray(string, ';', trim))
    .flatMap(element => parseWordArray(element, ',', trim))
    .flatMap(parse)
    .value()
}
