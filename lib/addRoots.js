const _ = require('lodash')

module.exports = function addRoots (entries, roots) {
  const rootMap = _.fromPairs(roots)
  return entries.map(entry => {
    if (rootMap[entry.legacyLemma]) {
      return {...entry, roots: rootMap[entry.legacyLemma], pos: 'V'}
    } else {
      return entry
    }
  })
}
