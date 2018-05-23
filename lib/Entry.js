const _ = require('lodash')

const Link = require('./Link')
const parseForms = require('./parseForms')
const parseDerived = require('./parseDerived')
const parseAmplifiedMeanings = require('./parseAmplifiedMeanings')
const extractLogograms = require('./extractLogograms')
const expandAlternatives = require('./expandAlternatives')

const dictionaryRowRegExp = /^\*\*(?<lemma>.+?)\*\*;?(?:\s(?<homonym>[IV]+))?(?<forms>(?:[,;]\s[^*"]*(?:\\\*)?\*[^*"]+\*[^*"]*?)+)?\s?(?<meaning>(?:"|'|\(|\w|\?|\\~|\\\[).+?)?(?<amplifiedMeanings>\s\*\*(?:\w+\.|G|Gtn|Gt|D|Dtn|Dt|Dtt|Š|Štn|Št|ŠD|N|Ntn|R)\*\*.+?;?)?\s*(?<derived>(?:\\>|\\<).+?)?$/

const defaultHomonym = 'I'
const defaultForms = []
const defaultDerived = []
const defaultDerivedFrom = null

module.exports = class Entry {
  constructor (row) {
    this.source = row
    this.match = dictionaryRowRegExp.exec(row)

    this.lemmaAlternatives = this.match
      ? this.match.groups.lemma
        .split(' ')
        .map(lemma => lemma.replace(/\\/g, ''))
        .map(lemma => _(expandAlternatives(lemma)).sortBy(_.size).value())
      : []
  }

  get lemma () {
    return this.lemmaAlternatives.map(_.head)
  }

  get homonym () {
    return this.match.groups.homonym || defaultHomonym
  }

  get forms () {
    const rawForms = this.match.groups.forms
    const mimations = _(this.lemmaAlternatives)
      .flatMap(_.tail)
      .map(mimation => ({form: mimation, notes: []}))
      .value()
    return (rawForms ? parseForms(rawForms) : defaultForms).concat(mimations)
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
    const rawDerived = derivedMatch ? derivedMatch[1] : null
    return rawDerived
      ? parseDerived(rawDerived)
      : defaultDerived
  }

  get derivedFrom () {
    const rawMatch = this.match.groups.derived || ''
    const derivedFromRegExp = /(?:\\>[^<]*)?\\<\s*\*([^\\]+)\*;?\s*(?:\\>)?/
    const derivedFromMatch = derivedFromRegExp.exec(rawMatch)
    const derivedFrom = derivedFromMatch ? derivedFromMatch[1] : null
    return derivedFrom || defaultDerivedFrom
  }

  get isLink () {
    return Link.isLink(this.source)
  }
}
