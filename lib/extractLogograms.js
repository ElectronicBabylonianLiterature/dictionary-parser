const _ = require('lodash')

const parseNotes = require('./parseNotes')
const expandAlternatives = require('./expandAlternatives')

module.exports = function extractLogograms (string) {
  const squareBracketRegExp = /(?<!\w)\\\[(?<logograms>.+?)\\\](?!\w)/
  const squareBracketsMatch = squareBracketRegExp.exec(string)

  return squareBracketsMatch
    ? _(squareBracketsMatch.groups.logograms)
      .split(';')
      .map(logogram => {
        const logogramRegExp = /^(?<preNote>(?:(?:OB|MB|NB|[A-Za-z*][a-z*().]*) )+?)?(?<logogram>(?:[ .0-9A-ZĀāÂâÁáÀàĒēÊêÉéÈèĪīÎîÍíÌìŪūÛûÚúÙùḪḫṬṭṢṣŠš]{2,}|\(.+?\))*)(?<postNote> [\w() .?*]+)?$/u
        const trimmedLogogram = logogram.trim()
        const logogramMatch = logogramRegExp.exec(trimmedLogogram)
        return _.isNil(logogramMatch)
          ? { notes: [trimmedLogogram] }
          : { logogram: logogramMatch.groups.logogram, notes: parseNotes(['preNote', 'postNote'], logogramMatch.groups) }
      })
      .flatMap(element => _.has(element, 'logogram')
        ? expandAlternatives(element.logogram).map(alternative => ({logogram: alternative, notes: element.notes}))
        : element
      )
      .map(element => ({
        logogram: _(element.logogram)
          .split(/(?<!\.) (?=[^)])/)
          .map(_.trim)
          .reject(_.isEmpty)
          .value(),
        notes: element.notes
      }))
      .value()
    : []
}
