const expandMimation = require('../lib/expandMimation.js')

describe('expandMimation', () => {
  it('generates all the forms when multiple mimations', () => {
    expect(expandMimation('(a)b(c)d')).toEqual(jasmine.arrayWithExactContents(['bd', 'abd', 'bcd', 'abcd']))
  })

  it('generates all the forms when one mimation', () => {
    expect(expandMimation('lemm(a)')).toEqual(jasmine.arrayWithExactContents(['lemm', 'lemma']))
  })

  it('returns the original if no parentheses', () => {
    expect(expandMimation('abc')).toEqual(['abc'])
  })
})
