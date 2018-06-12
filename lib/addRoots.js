const _ = require('lodash')
const createProgressBar = require('./createProgressBar')
const parseLemma = require('./parseLemma')

module.exports = function addRoots (entries, roots) {
  const lemmaRegExp = /^(?<lemma>.+?)(?: (?<homonym>(?:[IV]+\.?)+))?$/
  const parsedRoots = _(roots)
    .flatMap(([lemma, root]) => {
      const match = lemmaRegExp.exec(lemma)
      const homonyms = match.groups.homonym
        ? match.groups.homonym.split('.')
        : ['I']
      return homonyms.map(homonym => ({
        lemma: _.head(parseLemma(match.groups.lemma)),
        homonym: homonym,
        root: root,
        matched: false,
        source: `${lemma}, ${root}`
      }))
    })
    .value()

  const bar = createProgressBar('Adding roots', entries.length)

  const result = entries.map(entry => {
    function rootMatches (root) {
      return _.isEqual(root.lemma, entry.lemma) && root.homonym === entry.homonym
    }

    const root = _.find(parsedRoots, rootMatches)
    bar.tick()
    if (root) {
      root.matched = true
      return {...entry, root: root.root, pos: 'V'}
    } else {
      return entry
    }
  })

  return {
    entries: result,
    unmatchedRoots: _(parsedRoots)
      .reject('matched')
      .map('source')
      .value()
  }
}
