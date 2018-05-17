const _ = require('lodash')

module.exports = function parseNestedMeanings (string) {
  const conjugations = new RegExp(`^(${['G', 'Gtn', 'Gt', 'D', 'Dtn', 'Dt', 'Dtt', 'Š', 'Štn', 'Št', 'ŠD', 'N', 'Ntn', 'R'].map(_.escapeRegExp).join('|')})$`)
  const functions = /^[A-Z]\.$/
  const entires = /^\d\.$/

  const result = {}
  let topLevelKey
  let entryKey

  _(string.split('**')).map(candidate => _.trim(candidate, ' ;')).reject(_.isEmpty).forEach(candidate => {
    if (conjugations.test(candidate)) {
      entryKey = null
      topLevelKey = candidate
      result[topLevelKey] = {}
    } else if (functions.test(candidate)) {
      entryKey = null
      topLevelKey = candidate
      result[topLevelKey] = {}
    } else if (entires.test(candidate)) {
      if (!topLevelKey) {
        topLevelKey = 'implicit'
        result[topLevelKey] = {}
      }
      entryKey = candidate
    } else {
      if (entryKey) {
        result[topLevelKey][entryKey] = candidate
        entryKey = null
      } else {
        result[topLevelKey]['meaning'] = candidate
      }
    }
  })

  return result
}
