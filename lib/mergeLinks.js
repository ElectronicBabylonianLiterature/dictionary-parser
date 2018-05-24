const _ = require('lodash')

module.exports = function mergeLinks (entries, links) {
  const derivedForms = _.flatMap(links, link => link.toDerivedForms())
  const plainEntries = entries.map(entry => entry.toPlainObject())

  function merge (entry) {
    function entryIsTarget (derivedForm) {
      return _.isEqual(entry.lemma, derivedForm.key.lemma) && entry.homonym === derivedForm.key.homonym
    }

    const linkingDerivedForms = derivedForms.filter(entryIsTarget).map(derivedForm => derivedForm.value)

    return {
      ...entry,
      derived: entry.derived.concat(linkingDerivedForms)
    }
  }

  return plainEntries.map(merge)
}
