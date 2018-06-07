describe('parse', () => {
  const parse = require('../lib/parse')
  const entryRow = '**lemma** "meaning"'
  const linkRow = '**link** *cf.* *lemma*'

  it('parses entries', () => {
    expect(parse([entryRow])).toEqual({
      entries: [{
        lemma: [ 'lemma' ],
        attested: true,
        homonym: 'I',
        forms: [],
        meaning: '"meaning"',
        amplifiedMeanings: {},
        logograms: [],
        derived: [],
        derivedFrom: null,
        source: entryRow
      }],
      links: [],
      unlinked: []
    })
  })

  it('parses links', () => {
    expect(parse([entryRow, linkRow])).toEqual({
      entries: [
        jasmine.objectContaining({
          derived: [ [{ lemma: ['link'], homonym: 'I', notes: [], source: linkRow }] ]
        })
      ],
      links: [{
        lemmas: [ ['link'] ],
        targets: [ [ {lemma: [ 'lemma' ], homonym: 'I', notes: []} ] ],
        source: linkRow
      }],
      unlinked: []
    })
  })

  it('adds unmatched links to unlinked', () => {
    expect(parse([linkRow])).toEqual({
      entries: [],
      links: [{
        lemmas: [ ['link'] ],
        targets: [ [ {lemma: [ 'lemma' ], homonym: 'I', notes: []} ] ],
        source: linkRow
      }],
      unlinked: [linkRow]
    })
  })

  it('ignores empty rows', () => {
    expect(parse([entryRow, '    ']).entries.length).toBe(1)
  })

  it('unparseable rows have only source', () => {
    const unparseableRow = 'unparseable'
    expect(parse([unparseableRow])).toEqual({
      entries: [{source: unparseableRow}],
      links: [],
      unlinked: []
    })
  })
})
