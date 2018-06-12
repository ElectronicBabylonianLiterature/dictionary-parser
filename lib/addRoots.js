const _ = require('lodash')

module.exports = function addRoots (entries, roots) {
  const lemmaRegExp = /^(?<lemma>.+?)(?: (?<homonym>(?:[IV]+\.?)+))?$/
  const parsedRoots = _(roots)
    .flatMap(([lemma, root]) => {
      const match = lemmaRegExp.exec(lemma)
      const homonyms = match.groups.homonym
        ? match.groups.homonym.split('.')
        : ['I']
      return homonyms.map(homonym => ({
        lemma: match.groups.lemma,
        homonym: homonym,
        root: root
      }))
    })
    .value()

  return entries.map(entry => {
    const root = _.find(parsedRoots, root => root.lemma === entry.legacyLemma && root.homonym === entry.homonym)
    if (root) {
      return {...entry, root: root.root, pos: 'V'}
    } else {
      return entry
    }
  })
}
