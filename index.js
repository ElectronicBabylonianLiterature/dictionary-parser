const _ = require('lodash')

const parse = require('./lib/parse')
const readRows = require('./lib/readRows')
const saveJson = require('./lib/saveJson')
const checks = require('./lib/checks')

readRows(process.argv[2]).then(rows => {
  const dictionary = parse(rows)

  console.log(
    '❌ ', dictionary.entries.filter(_.negate(checks.hasLemma)).length + dictionary.links.filter(_.negate(checks.hasTargets)).length,
    '\n🔗 ', dictionary.links.filter(checks.hasTargets).length - dictionary.unlinked.length,
    ' 🚧 ', dictionary.unlinked.length,
    '\n✔️ ', dictionary.entries.filter(checks.isOk).length - dictionary.entries.filter(checks.isBroken).length,
    ' 🚧 ', dictionary.entries.filter(checks.isBroken).length,
    ' 💥 ', _.keys(dictionary.duplicates).length
  )

  return Promise.all([
    saveJson(dictionary.entries.filter(_.negate(checks.hasLemma)).map(entry => entry.source), 'unparseable.json'),
    saveJson(dictionary.entries.filter(checks.hasLemma), 'dictionary.json'),
    saveJson(dictionary.entries.filter(checks.isBroken), 'broken.json'),
    saveJson(dictionary.duplicates, 'duplicates.json'),
    saveJson(dictionary.links.filter(_.negate(checks.hasTargets)), 'unparseable-links.json'),
    saveJson(dictionary.links.filter(checks.hasTargets), 'links.json'),
    saveJson(dictionary.unlinked, 'broken-links.json')
  ])
}).catch(console.error)
