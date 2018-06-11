const _ = require('lodash')
const ProgressBar = require('progress')

function lemmaMatches (derived, other) {
  return _.isEqual(derived.lemma, other.lemma) || other.forms.some(form => _.isObject(form) && _.isEqual(derived.lemma, form.lemma))
}

function joinLemma (entry) {
  return entry.lemma.join(' ')
}

module.exports = function checkDerived (entries) {
  const title = _.padEnd('Checking derived forms', 32)
  const bar = new ProgressBar(`${title} [:bar] :percent :etas`, {total: entries.length, width: 50, renderThrottle: 1000})

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
