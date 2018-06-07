const fs = require('fs')
const _ = require('lodash')

const parse = require('./lib/parse')

function hasLemma (entry) {
  return _.has(entry, 'lemma')
}

function isBroken (entry) {
  const hasBrokenForms = _(entry.forms).some(_.isString)
  const hasBrokenDerived = _(entry.derived).flatten().some(_.isString)
  return hasBrokenForms || hasBrokenDerived
}

function isOk (entry) {
  return hasLemma(entry) && !isBroken(entry)
}

function hasTargets (link) {
  return _.every(link.targets, targets => _.isArray(targets) && _.every(targets, _.isObject))
}

function saveJson (dictionary, fileName) {
  return new Promise((resolve, reject) =>
    fs.writeFile(fileName, JSON.stringify(dictionary, null, '\t'), err => err ? reject(err) : resolve())
  )
}

function readRows (fileName) {
  return new Promise((resolve, reject) =>
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.split('\n'))
      }
    })
  )
}

readRows(process.argv[2]).then(rows => {
  const dictionary = parse(rows)

  console.log(
    '❌ ', dictionary.entries.filter(_.negate(hasLemma)).length + dictionary.links.filter(_.negate(hasTargets)).length,
    '\n🔗 ', dictionary.links.filter(hasTargets).length - dictionary.unlinked.length,
    ' 🚧 ', dictionary.unlinked.length,
    '\n✔️ ', dictionary.entries.filter(isOk).length - dictionary.entries.filter(isBroken).length,
    ' 🚧 ', dictionary.entries.filter(isBroken).length,
    ' 💥 ', _.keys(dictionary.duplicates).length
  )

  saveJson(dictionary.entries.filter(_.negate(hasLemma)).map(entry => entry.source), 'unparseable.json')
  saveJson(dictionary.entries.filter(hasLemma), 'dictionary.json')
  saveJson(dictionary.entries.filter(isBroken), 'broken.json')
  saveJson(dictionary.duplicates, 'duplicates.json')

  saveJson(dictionary.links.filter(_.negate(hasTargets)), 'unparseable-links.json')
  saveJson(dictionary.links.filter(hasTargets), 'links.json')
  saveJson(dictionary.unlinked, 'broken-links.json')
}).catch(console.error)
