const Entry = require('../lib/Entry')

describe('checks', () => {
  const checks = require('../lib/checks')

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
