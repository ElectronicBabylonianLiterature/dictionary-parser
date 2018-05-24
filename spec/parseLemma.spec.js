describe('parseLemma', () => {
  const parseLemma = require('../lib/parseLemma')

  it('removes markdown', () => {
    expect(parseLemma('\\*lem\\[ma\\]')).toEqual([['*lem[ma]']])
  })

  it('expands parentheses', () => {
    expect(parseLemma('lemm(a)')).toEqual([['lemm'], ['lemma']])
  })

  it('expands -um', () => {
    expect(parseLemma('lemmum')).toEqual([['lemmu'], ['lemmum']])
  })

  it('parses compound lemmas', () => {
    expect(parseLemma('lemma1 lemma2')).toEqual([['lemma1', 'lemma2']])
  })
})
