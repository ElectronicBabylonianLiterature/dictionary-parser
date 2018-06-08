const _ = require('lodash')

const parse = require('./parse')
const readRows = require('./readRows')
const saveJson = require('./saveJson')
const checks = require('./checks')

module.exports = async function main (fileName) {
  try {
    const rows = await readRows(fileName)
    const dictionary = parse(rows)

    console.log(
      '❌ ', dictionary.entries.filter(_.negate(checks.hasLemma)).length + dictionary.links.filter(_.negate(checks.hasTargets)).length,
      '\n🔗 ', dictionary.links.filter(checks.hasTargets).length - dictionary.unlinked.length,
      ' 🚧 ', dictionary.unlinked.length,
      '\n✔️ ', dictionary.entries.filter(checks.isOk).length - dictionary.entries.filter(checks.isBroken).length,
      ' 🚧 ', dictionary.entries.filter(checks.isBroken).length,
      ' 💥 ', _.keys(dictionary.duplicates).length
    )

    await Promise.all([
      saveJson(dictionary.entries.filter(_.negate(checks.hasLemma)).map(entry => entry.source), 'unparseable.json'),
      saveJson(dictionary.entries.filter(checks.hasLemma), 'dictionary.json'),
      saveJson(dictionary.entries.filter(checks.isBroken), 'broken.json'),
      saveJson(dictionary.duplicates, 'duplicates.json'),
      saveJson(dictionary.links.filter(_.negate(checks.hasTargets)), 'unparseable-links.json'),
      saveJson(dictionary.links.filter(checks.hasTargets), 'links.json'),
      saveJson(dictionary.unlinked, 'broken-links.json')
    ])
  } catch (error) {
    console.log(error)
  }
}
