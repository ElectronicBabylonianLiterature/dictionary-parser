const _ = require('lodash')

function hasLemma (entry) {
  return _.has(entry, 'lemma')
}

function hasBrokenForms (entry) {
  return _(entry.forms).some(_.isString)
}

function hasBrokenDerived (entry) {
  return _(entry.derived).flatten().some(_.isString)
}

function hasBrokenAmplifiedMeaning (entry) {
  return _(entry.derived)
    .flatten()
    .some(derived => _.isArray(derived.notes) && derived.notes.some(note => note.includes('**')))
}

function hasLostAmplifiedMeaning (entry) {
  return _(entry.amplifiedMeanings)
    .values()
    .flatMap(outer => [outer, ..._.values(outer)])
    .map(value => value.meaning)
    .some(value => _.isString(value) && value.includes('(') && !value.includes(')'))
}

function hasBrokenVowels (entry) {
  return _(entry.amplifiedMeanings)
    .values()
    .flatMap(outer => [outer, ..._.values(outer)])
    .flatMap(value => value.vowels)
    .compact()
    .flatMap(value => value.notes)
    .some(value => value.includes('(') && !value.includes(')'))
}

function hasTargets (link) {
  return _.every(link.targets, targets => _.isArray(targets) && _.every(targets, _.isObject))
}

module.exports = {
  hasBrokenAmplifiedMeaning: hasBrokenAmplifiedMeaning,
  hasBrokenDerived: hasBrokenDerived,
  hasBrokenForms: hasBrokenForms,
  hasLemma: hasLemma,
  hasLostAmplifiedMeaning: hasLostAmplifiedMeaning,
  hasTargets: hasTargets,
  hasBrokenVowels: hasBrokenVowels
}
