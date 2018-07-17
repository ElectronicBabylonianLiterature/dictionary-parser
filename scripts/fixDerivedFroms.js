/* eslint-disable no-undef */
const sourceRegex = /\\< ([^<>*]+)$/
db.words.find({
  $and: [
    {
      derivedFrom: null
    },
    {
      source: {
        $regex: sourceRegex
      }
    }
  ]
}).forEach(function (word) {
  const note = sourceRegex.exec(word.source)[1]
  word.derivedFrom = {
    lemma: [],
    homonym: '',
    notes: [
      note
    ]
  }
  db.words.save(word)
})
/* eslint-disable no-undef */
