const _ = require('lodash')

module.exports = function mergeLinks (entries, links) {
  const derivedForms = _.flatMap(links, link => link.toDerivedForms())
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
      return _(derivedForms)
        .filter(entryIsTarget)
        .map(derivedForm => {
          derivedForm.linked = true
          return derivedForm
        })
        .map(derivedForm => derivedForm.value)
        .value()
    }

    return {
      ...entry,
      derived: entry.derived.concat(getMatchingDerivedForms())
    }
  }

  const result = plainEntries.map(merge)
  console.log(JSON.stringify(_(derivedForms).reject(derivedForm => derivedForm.linked).map(derivedForm => derivedForm.value.source).value()))
  return result
}
