const parseLemma = require('../lib/parseLemma')

describe('Link', () => {
  const Link = require('../lib/Link')

  describe('isLink', () => {
    [
      '**\\*source** *cf.* *target*',
      '**\\*source** *cf.* *target* note',
      '**\\*source** *cf.* *target',
      '**source** *cf.* *target* extra',
      '**-source** *cf.* *-target*',
      '**source** etc. *cf.* *target*',
      '**source**, **source2** *cf.* *target*',
      '**source1 source2** *cf.* *target* 5'
    ].forEach(row => {
      it(`${row} is a link`, () => {
        expect(Link.isLink(row)).toEqual(true)
      })
    });

    [
      '**lemma** meaning; *cf.* *derived*',
      '**lemma** \\[LOG\\]; *cf.* *derived*'
    ].forEach(row => {
      it(`${row} is not a link`, () => {
        expect(Link.isLink(row)).toEqual(false)
      })
    })
  })

  it('parses lemma correctly', () => {
    const lemma = 'lemma(1) \\*lemma\\[2]\\'
    expect(new Link(`**${lemma}** *cf.* *target*`).lemmas).toEqual(parseLemma(lemma))
  })

  it('parses multiple lemmas correctly', () => {
    const lemma1 = 'lemma(1) \\*lemma\\[2]\\'
    const lemma2 = 'lemma(a) \\*lemma\\[b]\\'
    expect(new Link(`**${lemma1}**, **${lemma2}** *cf.* *target*`).lemmas).toEqual(parseLemma(lemma1).concat(parseLemma(lemma2)))
  })

  it('has source', () => {
    expect(new Link('source').source).toEqual('source')
  })
})
