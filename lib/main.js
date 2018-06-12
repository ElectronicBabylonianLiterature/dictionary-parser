const _ = require('lodash')

const readDictionary = require('./readDictionary')
const saveJson = require('./saveJson')
const checks = require('./checks')
const checkDerived = require('./checkDerived')

module.exports = async function main (dictionaryFileName, rootsFileName) {
  try {
    const dictionary = await readDictionary(dictionaryFileName, rootsFileName)
    const broken = {
      forms: dictionary.entries.filter(checks.hasBrokenForms),
      derived: dictionary.entries.filter(checks.hasBrokenDerived),
      unmatchedDerived: checkDerived(dictionary.entries.filter(checks.hasLemma)),
      amplifiedMeaning: dictionary.entries.filter(checks.hasBrokenAmplifiedMeaning),
      lostAmplifiedMeaning: dictionary.entries.filter(checks.hasLostAmplifiedMeaning),
      hasBrokenVowels: dictionary.entries.filter(checks.hasBrokenVowels),

      get size () {
        return _.sum([
          this.forms.length,
          this.derived.length,
          this.amplifiedMeaning.length,
          this.lostAmplifiedMeaning.length,
          this.unmatchedDerived.length,
          this.hasBrokenVowels.length
        ])
      }
    }

    console.log(
      '❌ ', dictionary.entries.filter(_.negate(checks.hasLemma)).length + dictionary.links.filter(_.negate(checks.hasTargets)).length,
      '\n🔗 ', dictionary.links.filter(checks.hasTargets).length,
      ' 🚧 ', dictionary.unlinked.length,
      '\n✔️ ', dictionary.entries.filter(checks.hasLemma).length,
      ' 🚧 ', broken.size,
      ' 💥 ', _.keys(dictionary.duplicates).length,
      ' ❓  ', dictionary.unmatchedRoots.length
    )

    await Promise.all([
      saveJson(dictionary.entries.filter(_.negate(checks.hasLemma)).map(entry => entry.source), 'unparseable.json'),
      saveJson(dictionary.entries.filter(checks.hasLemma), 'dictionary.json'),
      saveJson(broken, 'broken.json'),
      saveJson(dictionary.duplicates, 'duplicates.json'),
      saveJson(dictionary.unmatchedRoots, 'unmatched-roots.json'),
      saveJson(dictionary.links.filter(_.negate(checks.hasTargets)), 'unparseable-links.json'),
      saveJson(dictionary.links.filter(checks.hasTargets), 'links.json'),
      saveJson(dictionary.unlinked, 'broken-links.json')
    ])
  } catch (error) {
    console.log(error)
  }
}
