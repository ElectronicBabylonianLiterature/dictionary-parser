const _ = require('lodash')
const parseWordArray = require('./parseWordArray')
const parseNotes = require('./parseNotes')

module.exports = function parseForms (string) {
  function parse (element) {
    const formRegExp = /^(?:(.+)\s)?(?:\\(\*))?\*(.+)\*\s*(.+)?$/
    const starIndex = 2
    const lemmaIndex = 3
    const notesIndices = [1, 4]

    const match = formRegExp.exec(element)
    return match
      ? {
        lemma: (match[starIndex] || '') + match[lemmaIndex],
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
