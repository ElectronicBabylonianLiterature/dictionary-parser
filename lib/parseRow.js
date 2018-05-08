const dictionaryRowRegExp = /^\*\*([^\*]+)\*\*\s*(.*)/
module.exports = function parseRow(row) {
    const match = dictionaryRowRegExp.exec(row)
    return {
        lemma: match[1],
        definition: match[2],
        source: row
    }
}