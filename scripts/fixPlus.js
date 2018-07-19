/* eslint-disable no-undef */
db.words.find({
  'derivedFrom.notes.1': {
    $regex: /^\+/
  }
}).forEach(word => {
  word.derivedFrom.notes[1] = '\\' + word.derivedFrom.notes[1]
  db.words.save(word)
})
