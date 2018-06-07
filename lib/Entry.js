const _ = require('lodash')

const parseForms = require('./parseForms')
const parseDerived = require('./parseDerived')
const parseAmplifiedMeanings = require('./parseAmplifiedMeanings')
const extractLogograms = require('./extractLogograms')
const parseLemma = require('./parseLemma')

const dictionaryRowRegExp = /^\*\*(?<notAttested>\\\*)?(?<lemma>.+?)\*\*;?(?:\s(?<homonym>[IV]+))?(?<forms>(?:[,;]\s[^*"]*(?:\\\*)?\*[^*"]+\*[^*"]*?)+)?;?\s?(?<meaning>(?:"|'|\(|\w|\?|\\~|\\\[|\*cf.\*).+?)?(?<amplifiedMeanings>\s\*\*(?:\w+\.|G|Gtn|Gt|D|Dtn|Dt|Dtt|Š|Štn|Št|ŠD|N|Ntn|R|Št2)\*\*.+?;?)?\s*(?<derived>(?:\\>|\\<).+?)?$/

const defaultHomonym = 'I'
const defaultForms = []
const defaultDerived = []
const defaultDerivedFrom = null

module.exports = class Entry {
  constructor (row) {
    this.source = row
    this.match = dictionaryRowRegExp.exec(row)
    this.attested = this.match && !this.match.groups.notAttested
    this.legacyLemma = this.match && this.match.groups.lemma
    this.lemmaAlternatives = this.match
      ? parseLemma(this.match.groups.lemma)
      : []
  }

  get lemma () {
    return _.head(this.lemmaAlternatives)
  }

  get homonym () {
    return this.match.groups.homonym || defaultHomonym
  }

  get forms () {
    const rawForms = this.match.groups.forms
    const forms = rawForms ? parseForms(rawForms) : defaultForms
    const alternatives = _.tail(this.lemmaAlternatives).map(lemma => ({lemma: lemma, notes: []}))
    return forms.concat(alternatives)
  }

  get meaning () {
    return (this.match.groups.meaning || '').trim()
  }

  get amplifiedMeanings () {
    const rawAmplifiedMeanings = this.match.groups.amplifiedMeanings
    return parseAmplifiedMeanings(rawAmplifiedMeanings || '')
  }

  get logograms () {
    function extractDeep (entity) {
      return _.isString(entity)
        ? extractLogograms(entity)
        : _(entity).values().flatMap(extractDeep).value()
    }

    return _(extractDeep(this.meaning)).concat(extractDeep(this.amplifiedMeanings)).uniqWith(_.isEqual).value()
  }

  get derived () {
    const rawMatch = this.match.groups.derived || ''
    const derivedRegExp = /(?:\\<[^>]*)?\\>([^\\]+);?\s*(?:\\<)?/
    const derivedMatch = derivedRegExp.exec(rawMatch)
    return derivedMatch ? parseDerived(derivedMatch[1]) : defaultDerived
  }

  get derivedFrom () {
    const rawMatch = this.match.groups.derived || ''
    const derivedFromRegExp = /(?:\\>[^<]*)?\\<\s*\*(?<lemma>[^\\]+)\* ?(?<homonym>[IV]+)?;?\s*(?:\\>)?/
    const derivedFromMatch = derivedFromRegExp.exec(rawMatch)
    return derivedFromMatch
      ? {
        lemma: _.head(parseLemma(derivedFromMatch.groups.lemma)),
        homonym: derivedFromMatch.groups.homonym || defaultHomonym
      }
      : defaultDerivedFrom
  }

  toPlainObject () {
    return this.match
      ? {
        lemma: this.lemma,
        attested: this.attested,
        legacyLemma: this.legacyLemma,
        homonym: this.homonym,
        forms: this.forms,
        meaning: this.meaning,
        amplifiedMeanings: this.amplifiedMeanings,
        logograms: this.logograms,
        derived: this.derived,
        derivedFrom: this.derivedFrom,
        source: this.source
      }
      : {source: this.source}
  }
}
