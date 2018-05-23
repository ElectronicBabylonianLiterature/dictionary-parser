const _ = require('lodash')

const parseNotes = require('./parseNotes')
const expandAlternatives = require('./expandAlternatives')

module.exports = function extractLogograms (string) {
  const squareBracketRegExp = /(?<!\w)\\\[(?<logograms>.+?)\\\](?!\w)/
  const squareBracketsMatch = squareBracketRegExp.exec(string)

  const parse = logogram => {
    const logogramRegExp = /^(?<preNote>(?:(?:OB|MB|NB|OA|MA|NA|[A-Za-z*][a-z*().]*) )+?)?(?<logogram>(?:[.0-9A-ZĀāÂâÁáÀàĒēÊêÉéÈèĪīÎîÍíÌìŪūÛûÚúÙùḪḫṬṭṢṣŠš]{2,}|\(.+?\))*)(?<postNote> [\w() .?*]+)?$/u
    const logogramMatch = logogramRegExp.exec(logogram)
    return _.isNil(logogramMatch)
      ? { notes: [logogram] }
      : { logogram: logogramMatch.groups.logogram, notes: parseNotes(['preNote', 'postNote'], logogramMatch.groups) }
  }

  const expand = ({logogram, notes}) => ({
    logogram: _.isString(logogram) ? expandAlternatives(logogram) : [],
    notes: notes
  })

  return _.isObject(squareBracketsMatch)
    ? _(squareBracketsMatch.groups.logograms)
      .split(';')
      .map(_.trim)
      .map(parse)
      .map(expand)
      .value()
    : []
}
