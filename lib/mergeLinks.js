const _ = require('lodash')
const ProgressBar = require('progress')

function startsWith (targetLemma, linkLemma) {
  return _(targetLemma).head().startsWith(linkLemma)
}

function entryIsTarget (entry) {
  return derivedForm => {
    function lemmaMatches (target) {
      const targetLemma = target.parsedLemma || (target.parsedLemma = target.lemma.map(part => _.trimEnd(part, '-')))

      return derivedForm.isDotLink
        ? startsWith(targetLemma, derivedForm.lemmaWithoutDots)
        : _.isEqual(targetLemma, derivedForm.key.lemma
        )
    }

    return entry.homonym === derivedForm.key.homonym && (lemmaMatches(entry) || entry.forms.filter(_.isObject).some(lemmaMatches))
  }
}

function getMatchingDerivedForms (derivedFormsGroups, entry) {
  return derivedFormsGroups.map(derivedForms => derivedForms
    .filter(entryIsTarget(entry))
    .map(derivedForm => {
      derivedForm.linked = true
      return derivedForm
    })
    .map(derivedForm => {
      const value = _.omit(derivedForm.value, 'lemmaWithoutDots')
      if (derivedForm.isDotLink) {
        const linkValueLemma = derivedForm.value.lemmaWithoutDots
        const linkKeyLemma = derivedForm.lemmaWithoutDots
        const entryLemma = _([entry.lemma])
          .concat(entry.forms.map(form => form.lemma))
          .find(lemma => startsWith(lemma, linkKeyLemma))
        return {
          ...value,
          lemma: [
            `${linkValueLemma}${_.head(entryLemma).slice(linkKeyLemma.length)}`,
            ...(_.tail(entryLemma))
          ]
        }
      } else {
        return value
      }
    }))
}

function merge (derivedFormsGroups, entry) {
  return entry.lemma
    ? {
      ...(_.omit(entry, 'parsedLemma')),
      forms: entry.forms.map(form => _.isObject(form) ? _.omit(form, 'parsedLemma') : form),
      derived: _(entry.derived)
        .concat(getMatchingDerivedForms(derivedFormsGroups, entry))
        .reject(_.isEmpty)
        .value()
    }
    : entry
}

module.exports = function mergeLinks (entries, links) {
  const derivedFormsGroups = links.map(link => link.toDerivedForms())
  const title = _.padEnd('Merging links', 32)
  const bar = new ProgressBar(`${title} [:bar] :percent :etas`, {total: entries.length, width: 50, renderThrottle: 1000})

  const result = entries
    .map(entry => entry.toPlainObject())
    .map(entry => {
      const result = merge(derivedFormsGroups, entry)
      bar.tick()
      return result
    })

  const unlinked = _(derivedFormsGroups).flatten().reject(derivedForm => derivedForm.linked).map(derivedForm => derivedForm.value.source).uniq().value()

  return {entries: result, unlinked}
}
