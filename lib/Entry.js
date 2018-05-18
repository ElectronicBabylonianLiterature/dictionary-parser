const _ = require('lodash')

const parseForms = require('./parseForms')
const parseDerived = require('./parseDerived')
const parseAmplifiedMeanings = require('./parseAmplifiedMeanings')
const extractLogograms = require('./extractLogograms')

const dictionaryRowRegExp = /^\*\*(.+?)\*\*;?(\s([IV]+))?((?:[,;]\s[^*"]*(?:\\\*)?\*[^*"]+\*[^*"]*?)+)?\s?((?:"|'|\(|\w|\?|\\~).+?)?(\s\*\*(?:\w+\.|G|Gtn|Gt|D|Dtn|Dt|Dtt|Š|Štn|Št|ŠD|N|Ntn|R)\*\*.+?;?)?\s*((?:\\>|\\<).+?)?$/
const lemmaIndex = 1
const homonymIndex = 3
const formsIndex = 4
const meaningIndex = 5
const amplifiedMeaningsIndex = 6
const derivedIndex = 7

const defaultHomonym = 'I'
const defaultForms = []
const defaultDerived = []
const defaultDerivedFrom = null

module.exports = class Entry {
  constructor (row) {
    this.source = row
    this.match = dictionaryRowRegExp.exec(row)
  }

  get lemma () {
    const rawLemma = this.match[lemmaIndex]
    return /^\*?(.+?)(\s+|\*)?$/.exec(rawLemma)[1].split(' ').map(lemma => lemma.replace('\\*', '*'))
  }

  get homonym () {
    return this.match[homonymIndex] || defaultHomonym
  }

  get forms () {
    const rawForms = this.match[formsIndex]
    return rawForms
      ? parseForms(rawForms)
      : defaultForms
  }

  get meaning () {
    return (this.match[meaningIndex] || '').trim()
  }

  get amplifiedMeanings () {
    const rawAmplifiedMeanings = this.match[amplifiedMeaningsIndex]
    return parseAmplifiedMeanings(rawAmplifiedMeanings || '')
  }

  get logograms () {
    function extractDeep (entity) {
      if (_.isString(entity)) {
        return extractLogograms(entity)
      } else if (_.isArray(entity)) {
        return _.flatMap(entity, extractDeep)
      } else if (_.isObject(entity)) {
        return _(entity).values().flatMap(extractDeep).value()
      }
    }

    return _.concat(extractDeep(this.meaning), extractDeep(this.amplifiedMeanings))
  }

  get derived () {
    const rawMatch = this.match[derivedIndex] || ''
    const derivedRegExp = /(?:\\<[^>]*)?\\>([^\\]+);?\s*(?:\\<)?/
    const derivedMatch = derivedRegExp.exec(rawMatch)
    const rawDerived = derivedMatch ? derivedMatch[1] : null
    return rawDerived
      ? parseDerived(rawDerived)
      : defaultDerived
  }

  get derivedFrom () {
    const rawMatch = this.match[derivedIndex] || ''
    const derivedFromRegExp = /(?:\\>[^<]*)?\\<\s*\*([^\\]+)\*;?\s*(?:\\>)?/
    const derivedFromMatch = derivedFromRegExp.exec(rawMatch)
    const derivedFrom = derivedFromMatch ? derivedFromMatch[1] : null
    return derivedFrom || defaultDerivedFrom
  }

  get isLink () {
    const linkRexExp = /^(?:\*\*(?:\\\*)?[^\s]+\*\*(?:, | )?)+\s(?:etc\. )?\*cf\.\*?/
    return linkRexExp.test(this.source)
  }
}
