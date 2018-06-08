const _ = require('lodash')

const checks = {
  hasLemma (entry) {
    return _.has(entry, 'lemma')
  },

  isBroken (entry) {
    const hasBrokenForms = _(entry.forms).some(_.isString)
    const hasBrokenDerived = _(entry.derived).flatten().some(_.isString)
    const hasBrokenAmplifiedMeaning = _(entry.derived)
      .flatten()
      .some(derived => _.isArray(derived.notes) && derived.notes.some(note => note.includes('**')))
    const hasLostAmplifiedMeaning = _(entry.amplifiedMeanings)
      .values()
      .flatMap(_.values)
      .map(value => value.meaning)
      .some(value => _.isString(value) && value.includes('(') && !value.includes(')'))

    return hasBrokenForms || hasBrokenDerived || hasBrokenAmplifiedMeaning || hasLostAmplifiedMeaning
  },

  isOk (entry) {
    return checks.hasLemma(entry) && !checks.isBroken(entry)
  },

  hasTargets (link) {
    return _.every(link.targets, targets => _.isArray(targets) && _.every(targets, _.isObject))
  }
}

module.exports = checks
