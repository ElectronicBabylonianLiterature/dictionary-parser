const _ = require('lodash')

module.exports = function mergeLinks (entries, links) {
  const derivedForms = _.flatMap(links, link => link.toDerivedForms())
  const plainEntries = entries.map(entry => entry.toPlainObject())

  function merge (entry) {
    function entryIsTarget (derivedForm) {
      function lemmaMatches (target) {
        return _.isEqual(target.lemma, derivedForm.key.lemma)
      }

      return entry.homonym === derivedForm.key.homonym && (lemmaMatches(entry) || entry.forms.some(lemmaMatches))
    }

    function getMatchingDerivedForms () {
      return _(derivedForms)
        .filter(entryIsTarget)
        .map(derivedForm => derivedForm.value)
        .value()
    }

    return {
      ...entry,
      derived: entry.derived.concat(getMatchingDerivedForms())
    }
  }

  return plainEntries.map(merge)
}
