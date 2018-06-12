const _ = require('lodash')
const createProgressBar = require('./createProgressBar')

const joinLemma = require('./joinLemma')

function lemmaMatches (derived, other) {
  return _.isEqual(derived.lemma, other.lemma) || other.forms.some(form => _.isObject(form) && _.isEqual(derived.lemma, form.lemma))
}

module.exports = function checkDerived (entries) {
  const bar = createProgressBar('Checking derived forms', entries.length)

  return _(entries)
    .flatMap(entry => {
      const result = _(entry.derived)
        .flatten()
        .filter(_.isObject)
        .reject(derived => _.isString(derived.source))
        .reject(derived => entries.some(other => derived.homonym === other.homonym && lemmaMatches(derived, other)))
        .map(joinLemma)
        .map(element => `${joinLemma(entry)}: ${element}`)
        .value()
      bar.tick()
      return result
    })
    .reject(_.isEmpty)
    .value()
}
