const dictionaryRowRegExp = /^\*\*(?<lemma>[^\*]+)\*\*\s*(?<definition>.*)/

module.exports = function parseRow(row) {
    const match = dictionaryRowRegExp.exec(row)
    return {
        ...match.groups,
        source: row
    }
}