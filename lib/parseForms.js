const _ = require('lodash')
const parseWordArray = require('./parseWordArray')
const parseNotes = require('./parseNotes')

module.exports = function parseForms (string) {
  function parse (element) {
    const formRegExp = /^(.+)?\s*\*(.+)\*\s*(.+)?$/
    const lemmaIndex = 2
    const notesIndices = [1, 3]

    const match = formRegExp.exec(element)
    return match
      ? {
        lemma: match[lemmaIndex],
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
