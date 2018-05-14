const _ = require('lodash')
const parseWordArray = require('./parseWordArray')

module.exports = function parseForms (string) {
  function parse (element) {
    const formRegExp = /^(.+)?\s*\*(.+)\*\s*(.+)?$/
    const lemmaIndex = 2
    const notesIndices = [1, 3]

    const match = formRegExp.exec(element)
    return match
      ? {
        lemma: match[lemmaIndex],
        notes: notesIndices.map(i => match[i]).filter(_.isString).map(_.trim).filter(note => !_.isEmpty(note))
      }
      : element
  }

  const trim = ' '
  return _(parseWordArray(string, ';', trim))
    .flatMap(element => parseWordArray(element, ',', trim))
    .map(parse)
    .value()
}
