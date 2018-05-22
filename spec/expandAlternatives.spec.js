const expandAlternatives = require('../lib/expandAlternatives.js')

describe('expandAlternatives', () => {
  it('generates all the forms when multiple mimations', () => {
    expect(expandAlternatives('(a)b(c)d')).toEqual(jasmine.arrayWithExactContents(['bd', 'abd', 'bcd', 'abcd']))
  })

  it('generates all the forms when one mimation', () => {
    expect(expandAlternatives('lemm(a)')).toEqual(jasmine.arrayWithExactContents(['lemm', 'lemma']))
  })

  it('returns the original if no parentheses', () => {
    expect(expandAlternatives('abc')).toEqual(['abc'])
  })
})
