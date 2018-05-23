describe('parseLemma', () => {
  const parseLemma = require('../lib/parseLemma')

  it('removes markdown', () => {
    expect(parseLemma('\\*lem\\[ma\\]')).toEqual([['*lem[ma]']])
  })

  it('expands parentheses and sort by length', () => {
    expect(parseLemma('lemm(a)')).toEqual([['lemm'], ['lemma']])
  })

  it('parses compound lemmas', () => {
    expect(parseLemma('lemma1 lemma2')).toEqual([['lemma1', 'lemma2']])
  })
})
