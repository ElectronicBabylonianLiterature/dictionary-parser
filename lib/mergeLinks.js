const _ = require('lodash')

module.exports = function mergeLinks (entries, links) {
  const derivedFormsGroups = links.map(link => link.toDerivedForms())
  const dots = '...'

  function headWithoutDots (lemma) {
    return _.head(lemma).slice(0, -dots.length)
  }

  function isDotLink (derivedForm) {
    return _(derivedForm.key.lemma).head().endsWith(dots)
  }

  function isDotMatch (targetLemma, linkLemma) {
    return _(targetLemma).head().startsWith(headWithoutDots(linkLemma))
  }

  function entryIsTarget (entry) {
    return derivedForm => {
      function lemmaMatches (target) {
        const targetLemma = target.lemma.map(part => _.trimEnd(part, '-'))
        const linkLemma = derivedForm.key.lemma

        return isDotLink(derivedForm)
          ? isDotMatch(targetLemma, linkLemma)
          : _.isEqual(targetLemma, linkLemma)
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
      .map(derivedForm => {
        if (isDotLink(derivedForm)) {
          const linkValueLemma = _.head(derivedForm.value.lemma).slice(0, -dots.length)
          const linkKeyLemma = derivedForm.key.lemma
          const entryLemma = _([entry.lemma])
            .concat(entry.forms.map(form => form.lemma))
            .find(lemma => isDotMatch(lemma, linkKeyLemma))
          return {
            ...derivedForm.value,
            lemma: [
              `${linkValueLemma}${_.head(entryLemma).slice(headWithoutDots(linkKeyLemma).length)}`,
              ...(_.tail(entryLemma))
            ]
          }
        } else {
          return derivedForm.value
        }
      }))
  }

  function merge (entry) {
    return entry.lemma
      ? {
        ...entry,
        derived: _(entry.derived)
          .concat(getMatchingDerivedForms(entry))
          .reject(_.isEmpty)
          .value()
      }
      : entry
  }

  const result = entries
    .map(entry => entry.toPlainObject())
    .map(merge)

  const unlinked = _(derivedFormsGroups).flatten().reject(derivedForm => derivedForm.linked).map(derivedForm => derivedForm.value.source).uniq().value()

  return {entries: result, unlinked}
}
