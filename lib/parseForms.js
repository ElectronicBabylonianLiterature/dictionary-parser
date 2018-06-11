const _ = require('lodash')
const parseWordArray = require('./parseWordArray')
const parseNotes = require('./parseNotes')
const parseLemma = require('./parseLemma')

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
    .flatMap(element => parseWordArray(element, /(?<!(?:OAkk|OA|MA|NA|OB|MB|NB|jB|f\.|m\.|Am\.|\(?Bogh.\)?|Ass\.|Alal\.|Nuzi|Ug\.|Bab\.|Mari|Hurr\.|Susa|freq\.|occas\.|phps\.)\??),/g, trim))
    .flatMap(parse)
    .value()
}
