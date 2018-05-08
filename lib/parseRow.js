module.exports = function parseRow(row) { 
    return {
        lemma: /^\*\*([^\*]+)\*\*/.exec(row)[1]
    }
}