const Entry = require('../lib/Entry')

describe('checks', () => {
  const checks = require('../lib/checks')

  describe('hasLemma', () => {
    it('returns true parsed entries', () => {
      const correctEntry = new Entry('**lemma** meaning').toPlainObject()
      expect(checks.hasLemma(correctEntry)).toEqual(true)
    })

    it('returns false for unparseable entries', () => {
      const brokenEntry = new Entry('something completly different').toPlainObject()
      expect(checks.hasLemma(brokenEntry)).toEqual(false)
    })
  })

  describe('hasBrokenForms', () => {
    it('returns false for correct forms', () => {
      const correctEntry = new Entry('**lemma**, *form* meaning').toPlainObject()
      expect(checks.hasBrokenForms(correctEntry)).toEqual(false)
    })

    it('returns false for no forms', () => {
      const correctEntry = new Entry('**lemma** meaning').toPlainObject()
      expect(checks.hasBrokenForms(correctEntry)).toEqual(false)
    })

    it('returns true for unparseable forms', () => {
      const brokenEntry = new Entry('**lemma**, *broken, forms* meaning').toPlainObject()
      expect(checks.hasBrokenForms(brokenEntry)).toEqual(true)
    })
  })

  describe('hasBrokenDerived', () => {
    it('returns false for correct derived forms', () => {
      const correctEntry = new Entry('**lemma** meaning \\> *derived*').toPlainObject()
      expect(checks.hasBrokenDerived(correctEntry)).toEqual(false)
    })

    it('returns false for no derived forms', () => {
      const correctEntry = new Entry('**lemma** meaning').toPlainObject()
      expect(checks.hasBrokenDerived(correctEntry)).toEqual(false)
    })

    it('returns true for unparseable derived forms', () => {
      const brokenEntry = new Entry('**lemma** meaning \\> *broken, derived*').toPlainObject()
      expect(checks.hasBrokenDerived(brokenEntry)).toEqual(true)
    })
  })

  describe('hasBrokenAmplifiedMeaning', () => {
    it('returns false for correct amplified meaning', () => {
      const correctEntry = new Entry('**lemma** meaning **G** meaning').toPlainObject()
      expect(checks.hasBrokenAmplifiedMeaning(correctEntry)).toEqual(false)
    })

    it('returns false for no amplified meaning', () => {
      const correctEntry = new Entry('**lemma** meaning').toPlainObject()
      expect(checks.hasBrokenAmplifiedMeaning(correctEntry)).toEqual(false)
    })

    it('returns true for incorrectly parsed amplified meaning', () => {
      const correctEntry = new Entry('**lemma** meaning **G** \\> *broken* **D** meaning').toPlainObject()
      expect(checks.hasBrokenAmplifiedMeaning(correctEntry)).toEqual(true)
    })
  })

  describe('hasLostAmplifiedMeaning', () => {
    it('returns false for correct amplified meaning', () => {
      const correctEntry = new Entry('**lemma** meaning **G** meaning').toPlainObject()
      expect(checks.hasLostAmplifiedMeaning(correctEntry)).toEqual(false)
    })

    it('returns false for no amplified meaning', () => {
      const correctEntry = new Entry('**lemma** meaning').toPlainObject()
      expect(checks.hasLostAmplifiedMeaning(correctEntry)).toEqual(false)
    })

    it('returns true for lost amplified meaning', () => {
      const correctEntry = new Entry('**lemma** meaning **D** (or **Gt** ?)').toPlainObject()
      expect(checks.hasLostAmplifiedMeaning(correctEntry)).toEqual(true)
    })
  })

  describe('hasBrokenVowels', () => {
    it('returns true for broken vowels in conjugation/function', () => {
      const brokenWovelsInConjugation = new Entry('**lemma** meaning **G** (*i/i*; stat. *(l)lemma*, also *lemma*)').toPlainObject()
      expect(checks.hasBrokenVowels(brokenWovelsInConjugation)).toEqual(true)
    })

    it('returns true broken vowels in entries', () => {
      const brokenWovelsInEntry = new Entry('**lemma** meaning **G** **1.** (*i/i*; stat. *(l)lemma*, also *lemma*)').toPlainObject()
      expect(checks.hasBrokenVowels(brokenWovelsInEntry)).toEqual(true)
    })

    it('returns false for intact vowels', () => {
      const wovelsInEntry = new Entry('**lemma** meaning **G** **1.** (*i/i*)').toPlainObject()
      expect(checks.hasBrokenVowels(wovelsInEntry)).toEqual(false)
    })

    it('returns false if no vowels present', () => {
      const wovelsInEntry = new Entry('**lemma** meaning **G** meaning').toPlainObject()
      expect(checks.hasBrokenVowels(wovelsInEntry)).toEqual(false)
    })

    it('returns false if no conjugations/functions present', () => {
      const wovelsInEntry = new Entry('**lemma** meaning').toPlainObject()
      expect(checks.hasBrokenVowels(wovelsInEntry)).toEqual(false)
    })
  })
})
