const _ = require('lodash')
const parseWordArray = require('./parseWordArray')
const parseNotes = require('./parseNotes')

module.exports = function parseForms (string) {
  function parse (element) {
    const formRegExp = /^(?:(?<preNote>.+)\s)?(?:\\(?<star>\*))?\*(?<lemma>.+)\*\s*(?<postNote>.+)?$/
    const notesIndices = ['preNote', 'postNote']

    const match = formRegExp.exec(element)
    return match
      ? {
        lemma: `${match.groups.star || ''}${match.groups.lemma}`.split(' '),
        notes: parseNotes(notesIndices, match.groups)
      }
      : element
  }

  const trim = ' '
  return _(parseWordArray(string, ';', trim))
    .flatMap(element => parseWordArray(element, ',', trim))
    .map(parse)
    .value()
}
