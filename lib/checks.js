const _ = require('lodash')

function extractFromAmplifiedMeaning (entry, field) {
  return _(entry.amplifiedMeanings)
    .values()
    .flatMap(outer => [_.omit(outer, 'entries'), ...outer.entries])
    .flatMap(value => value[field])
    .compact()
}

function hasBrokenBrackets (value) {
  return value.includes('(') && !value.includes(')')
}

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
  return extractFromAmplifiedMeaning(entry, 'meaning')
    .some(hasBrokenBrackets)
}

function hasBrokenVowels (entry) {
  return extractFromAmplifiedMeaning(entry, 'vowels')
    .flatMap(value => value.notes)
    .some(hasBrokenBrackets)
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
