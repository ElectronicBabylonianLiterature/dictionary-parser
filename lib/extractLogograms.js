const _ = require('lodash')

const parseNotes = require('./parseNotes')
const expandAlternatives = require('./expandAlternatives')

module.exports = function extractLogograms (string) {
  const squareBracketRegExp = /(?<!\w)\\\[(?<logograms>.+?)\\\](?!\w)/
  const squareBracketsMatch = squareBracketRegExp.exec(string)

  const parse = logogram => {
    const logogramRegExp = /^(?<preNote>(?:(?:OB|MB|NB|OA|MA|NA|[A-Za-z*][a-z*().]*) )+?)?(?<logogram>(?:[ .0-9A-ZĀāÂâÁáÀàĒēÊêÉéÈèĪīÎîÍíÌìŪūÛûÚúÙùḪḫṬṭṢṣŠš]{2,}|\(.+?\))*)(?<postNote> [\w() .?*]+)?$/u
    const logogramMatch = logogramRegExp.exec(logogram)
    return _.isNil(logogramMatch)
      ? { notes: [logogram] }
      : { logogram: logogramMatch.groups.logogram, notes: parseNotes(['preNote', 'postNote'], logogramMatch.groups) }
  }

  const expand = element => _.has(element, 'logogram')
    ? expandAlternatives(element.logogram).map(alternative => ({ logogram: alternative, notes: element.notes }))
    : element

  const split = ({logogram, notes}) => ({
    logogram: _(logogram)
      .split(/(?<!\.) (?=[^)])/)
      .map(_.trim)
      .reject(_.isEmpty)
      .value(),
    notes: notes
  })

  return _.isObject(squareBracketsMatch)
    ? _(squareBracketsMatch.groups.logograms)
      .split(';')
      .map(_.trim)
      .map(parse)
      .flatMap(expand)
      .map(split)
      .value()
    : []
}
