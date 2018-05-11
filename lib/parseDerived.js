const _ = require('lodash')
const parseWordArray = require('./parseWordArray')
const defaultHomonym = 'I'

module.exports = function parseDerived (string) {
  function parse (element) {
    const derivedRegExp = /^(?:\*(cf.)\*)?\s*\*([^*]+)(?:\s|\*)*([IV.]+)?(.*)\s*$/
    const lemmaIndex = 2
    const homonymIndex = 3
    const notesIndices = [1, 4]

    const match = derivedRegExp.exec(element)
    return match
      ? {
        lemma: match[lemmaIndex],
        homonym: match[homonymIndex] || defaultHomonym,
        notes: notesIndices.map(i => match[i]).filter(_.isString).map(_.trim).filter(note => !_.isEmpty(note))
      }
      : element
  }

  function splitByHomonym (derived) {
    return _.isString(derived.homonym)
      ? derived.homonym.split('.').map(homonym => ({ ...derived, homonym: homonym }))
      : derived
  }

  return parseWordArray(string, ';', ' \\>')
    .map(element => _(parseWordArray(element, ',', ' '))
      .map(parse)
      .flatMap(splitByHomonym)
      .value())
}
