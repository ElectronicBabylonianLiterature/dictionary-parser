const parseLemma = require('../lib/parseLemma')
const parseDerived = require('../lib/parseDerived')

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
      '**lemma** \\[LOG\\]; *cf.* *derived*',
      '**lemma** *cf.* "meaning" note; \\< *lemma*',
      '**lemma** *cf.* *form* I; *form* **lemma** I (meaning) notes, NA \\[LOG\\]'
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

  it('parses target correctly', () => {
    const target = '*target1* I.II; *target2* 3, *target3* note'
    expect(new Link(`**lemma** *cf.* ${target}`).targets).toEqual(parseDerived(target))
  })

  it('has source', () => {
    expect(new Link('source').source).toEqual('source')
  })
})
