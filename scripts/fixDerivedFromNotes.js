/* eslint-disable no-undef */
const sourceRegExp = /\\< \*([^*]+)\*[IV ]*[^;<>*]+/

db.words.find({
  $and: [
    { 'derivedFrom.notes.1': {$exists: false} },
    { 'derivedFrom.notes.0': {$exists: true} },
    { source: {$regex: sourceRegExp} }
  ]
}).forEach(function (word) {
  const match = sourceRegExp.exec(word.source)
  const lemma = match[1]
    .replace(/\([^()]+\)/g, '')
    .replace(/([uû])m$/, '$1')
    .replace(/(.)\/./g, '$1')

  if (word.derivedFrom.lemma.join(' ') === lemma || `${word.derivedFrom.lemma[0][0]}.` === lemma) {
    word.derivedFrom.notes = [
      '',
      ...word.derivedFrom.notes
    ]
    db.words.save(word)
  }
})
