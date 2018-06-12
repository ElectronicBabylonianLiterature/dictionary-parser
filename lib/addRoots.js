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
    function rootMatches (candidateRoot) {
      return _.isEqual(candidateRoot.lemma, entry.lemma) && candidateRoot.homonym === entry.homonym
    }

    const roots = _.filter(parsedRoots, rootMatches)
    bar.tick()
    if (_.isEmpty(roots)) {
      return {...entry, pos: ''}
    } else {
      for (let matchingRoot of roots) {
        matchingRoot.matched = true
      }
      return {
        ...entry,
        roots: _(roots)
          .map(matchingRoot => matchingRoot.root)
          .uniq()
          .value(),
        pos: 'V'
      }
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
