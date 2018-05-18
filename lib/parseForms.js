const _ = require('lodash')
const parseWordArray = require('./parseWordArray')
const parseNotes = require('./parseNotes')

module.exports = function parseForms (string) {
  function parse (element) {
    const formRegExp = /^(?:(.+)\s)?(?:\\(?<star>\*))?\*(?<lemma>.+)\*\s*(.+)?$/
    const notesIndices = [1, 4]

    const match = formRegExp.exec(element)
    return match
      ? {
        lemma: (match.groups.star || '') + match.groups.lemma,
        notes: parseNotes(notesIndices, match)
      }
      : element
  }

  const trim = ' '
  return _(parseWordArray(string, ';', trim))
    .flatMap(element => parseWordArray(element, ',', trim))
    .map(parse)
    .value()
}
