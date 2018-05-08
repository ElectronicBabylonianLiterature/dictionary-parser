function parseLemma (rawLemma) {
  return /^\*?(.+?)\*?$/.exec(rawLemma)[1].replace('\\*', '*')
}

module.exports = function parseRow (row) {
  const dictionaryRowRegExp = /^\*\*(.+)\*\*(\s([IV]+))?(,.+)?\s(("|\().*)/
  const lemmaIndex = 1
  const homonymIndex = 3
  const formsIndex = 4
  const definitionIndex = 5

  const defaultHomonym = 'I'
  const defaultForms = ''
  const match = dictionaryRowRegExp.exec(row)

  return {
    lemma: parseLemma(match[lemmaIndex]),
    homonym: match[homonymIndex] || defaultHomonym,
    forms: match[formsIndex] || defaultForms,
    definition: match[definitionIndex],
    source: row
  }
}
