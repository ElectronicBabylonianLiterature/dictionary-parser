const expandParentheses = require('../lib/expandParentheses.js')

describe('expandAlternatives', () => {
  it('generates all the forms when multiple mimations', () => {
    expect(expandParentheses('(a)b(c)d')).toEqual(jasmine.arrayWithExactContents(['bd', 'abd', 'bcd', 'abcd']))
  })

  it('generates all the forms when one mimation', () => {
    expect(expandParentheses('lemm(a)')).toEqual(jasmine.arrayWithExactContents(['lemm', 'lemma']))
  })

  it('returns the original if no parentheses', () => {
    expect(expandParentheses('abc')).toEqual(['abc'])
  })

  it('does not expand parantheses with ingored content', () => {
    expect(expandParentheses('a(bc)c', 'bc')).toEqual(['a(bc)c'])
  })
})
