const _ = require('lodash')

module.exports = function mergeLinks (entries, links) {
  const derivedFormsGroups = links.map(link => link.toDerivedForms())

  function entryIsTarget (entry) {
    return derivedForm => {
      function lemmaMatches (target) {
        const targetLemma = target.lemma.map(part => part.endsWith('-') ? part.slice(0, -1) : part)
        return _.isEqual(targetLemma, derivedForm.key.lemma)
      }

      return entry.homonym === derivedForm.key.homonym && (lemmaMatches(entry) || entry.forms.filter(_.isObject).some(lemmaMatches))
    }
  }

  function getMatchingDerivedForms (entry) {
    return derivedFormsGroups.map(derivedForms => derivedForms
      .filter(entryIsTarget(entry))
      .map(derivedForm => {
        derivedForm.linked = true
        return derivedForm
      })
      .map(derivedForm => derivedForm.value))
  }

  function merge (entry) {
    return {
      ...entry,
      derived: _(entry.derived)
        .concat(getMatchingDerivedForms(entry))
        .reject(_.isEmpty)
        .value()
    }
  }

  const result = entries
    .map(entry => entry.toPlainObject())
    .map(merge)

  const unlinked = _(derivedFormsGroups).flatten().reject(derivedForm => derivedForm.linked).map(derivedForm => derivedForm.value.source).uniq().value()

  return {entries: result, unlinked}
}
