const _ = require('lodash')
const createProgressBar = require('./createProgressBar')
const parseLemma = require('./parseLemma')

function parseRoots (roots) {
  const lemmaRegExp = /^(?<lemma>.+?)(?: (?<homonym>(?:[IV]+\.?)+))?$/

  return _(roots)
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
}

function add (parsedRoots, entry) {
  function rootMatches (candidateRoot) {
    return _.isEqual(candidateRoot.lemma, entry.lemma) && candidateRoot.homonym === entry.homonym
  }

  const matchingRoots = _.filter(parsedRoots, rootMatches)
  for (let matchingRoot of matchingRoots) {
    matchingRoot.matched = true
  }

  return _.isEmpty(matchingRoots)
    ? {...entry, pos: ''}
    : {
      ...entry,
      roots: _(matchingRoots)
        .map(matchingRoot => matchingRoot.root)
        .uniq()
        .value(),
      pos: 'V'
    }
}

module.exports = function addRoots (entries, roots) {
  const parsedRoots = parseRoots(roots)
  const bar = createProgressBar('Adding roots', entries.length)

  const result = entries.map(entry => {
    const withRoots = add(parsedRoots, entry)
    bar.tick()
    return withRoots
  })

  return {
    entries: result,
    unmatchedRoots: _(parsedRoots)
      .reject('matched')
      .map('source')
      .value()
  }
}
