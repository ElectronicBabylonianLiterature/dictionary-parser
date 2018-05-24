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

  describe('toDerivedForms', () => {
    it('creates correct value', () => {
      const link = new Link(`**lemma** *cf.* preNotes *target* postNotes`)
      expect(link.toDerivedForms()).toEqual([
        jasmine.objectContaining({value: {lemma: ['lemma'], homonym: 'I', notes: ['preNotes', 'postNotes'], source: link.source}})
      ])
    })

    it('creates correct key', () => {
      expect(new Link(`**lemma** *cf.* *target*`).toDerivedForms()).toEqual([
        jasmine.objectContaining({key: {lemma: ['target'], homonym: 'I'}})
      ])
    })

    it('creates entry for each target', () => {
      expect(new Link(`**lemma** *cf.* *target1*, *target2*`).toDerivedForms()).toEqual([
        jasmine.objectContaining({key: {lemma: ['target1'], homonym: 'I'}}),
        jasmine.objectContaining({key: {lemma: ['target2'], homonym: 'I'}})
      ])
    })

    it('creates entry for each homonym', () => {
      expect(new Link(`**lemma** *cf.* *target* II.III`).toDerivedForms()).toEqual([
        jasmine.objectContaining({key: {lemma: ['target'], homonym: 'II'}}),
        jasmine.objectContaining({key: {lemma: ['target'], homonym: 'III'}})
      ])
    })

    it('creates correct key for compound lemma', () => {
      expect(new Link(`**lemma** *cf.* *part1 part2*`).toDerivedForms()).toEqual([
        jasmine.objectContaining({key: {lemma: ['part1', 'part2'], homonym: 'I'}})
      ])
    })

    it('creates entry for each lemma', () => {
      const link = new Link(`**lemma1**, **lemma2** *cf.* *target*`)
      expect(link.toDerivedForms()).toEqual([
        jasmine.objectContaining({value: {lemma: ['lemma1'], homonym: 'I', notes: [], source: link.source}}),
        jasmine.objectContaining({value: {lemma: ['lemma2'], homonym: 'I', notes: [], source: link.source}})
      ])
    })

    it('creates correct value for each compound lemma', () => {
      const link = new Link(`**part1 part2** *cf.* *target*`)
      expect(link.toDerivedForms()).toEqual([
        jasmine.objectContaining({value: {lemma: ['part1', 'part2'], homonym: 'I', notes: [], source: link.source}})
      ])
    })

    it('creates correct value for each expanded lemma', () => {
      const link = new Link(`**lemm(a)** *cf.* *target*`)
      expect(link.toDerivedForms()).toEqual([
        jasmine.objectContaining({value: {lemma: ['lemm'], homonym: 'I', notes: [], source: link.source}}),
        jasmine.objectContaining({value: {lemma: ['lemma'], homonym: 'I', notes: [], source: link.source}})
      ])
    })
  })
})
