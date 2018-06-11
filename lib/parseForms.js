const _ = require('lodash')
const parseWordArray = require('./parseWordArray')
const parseNotes = require('./parseNotes')
const parseLemma = require('./parseLemma')
const formSplitRegexp = require('./formSplitRegexp')

module.exports = function parseForms (string) {
  function parse (element) {
    const formRegExp = /^(?:(?<preNote>.+)\s)?(?:\\(?<star>\*))?\*(?<lemma>.+)\*\s*(?<postNote>.+)?$/
    const notesIndices = ['preNote', 'postNote']

    const match = formRegExp.exec(element)
    return match
      ? parseLemma(match.groups.lemma).map(lemma => ({
        lemma: lemma,
        attested: _.isNil(match.groups.star),
        notes: parseNotes(notesIndices, match.groups)
      }))
      : element
  }

  const trim = ' '
  return _(parseWordArray(string, ';', trim))
    .flatMap(element => parseWordArray(element, formSplitRegexp(), trim))
    .flatMap(parse)
    .value()
}
