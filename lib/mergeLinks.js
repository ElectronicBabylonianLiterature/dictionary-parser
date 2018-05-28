const _ = require('lodash')

module.exports = function mergeLinks (entries, links) {
  const derivedFormsGroups = links.map(link => link.toDerivedForms())
  const plainEntries = entries.map(entry => entry.toPlainObject())

  function merge (entry) {
    function entryIsTarget (derivedForm) {
      function lemmaMatches (target) {
        const targetLemma = target.lemma.map(part => part.endsWith('-') ? part.slice(0, -1) : part)
        return _.isEqual(targetLemma, derivedForm.key.lemma)
      }

      return entry.homonym === derivedForm.key.homonym && (lemmaMatches(entry) || entry.forms.filter(_.isObject).some(lemmaMatches))
    }

    function getMatchingDerivedForms () {
      return derivedFormsGroups.map(derivedForms => derivedForms
        .filter(entryIsTarget)
        .map(derivedForm => derivedForm.value))
    }

    return {
      ...entry,
      derived: _(entry.derived).concat(getMatchingDerivedForms()).reject(_.isEmpty).value()
    }
  }

  return plainEntries.map(merge)
}
