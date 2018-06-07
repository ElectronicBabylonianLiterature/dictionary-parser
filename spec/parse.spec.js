const Entry = require('../lib/Entry')

describe('parse', () => {
  const parse = require('../lib/parse')
  const entryRow = '**lemma** "meaning"'
  const linkRow = '**link** *cf.* *lemma*'
  const emptyResult = {
    entries: [],
    links: [],
    unlinked: [],
    duplicates: {}
  }

  it('parses entries', () => {
    expect(parse([entryRow])).toEqual({
      ...emptyResult,
      entries: [new Entry(entryRow).toPlainObject()]
    })
  })

  it('parses links', () => {
    expect(parse([entryRow, linkRow])).toEqual({
      ...emptyResult,
      entries: [
        jasmine.objectContaining({
          derived: [ [{ lemma: ['link'], homonym: 'I', notes: [], source: linkRow }] ]
        })
      ],
      links: [{
        lemmas: [ ['link'] ],
        targets: [ [ {lemma: [ 'lemma' ], homonym: 'I', notes: []} ] ],
        source: linkRow
      }]
    })
  })

  it('adds unmatched links to unlinked', () => {
    expect(parse([linkRow])).toEqual({
      ...emptyResult,
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
      ...emptyResult,
      entries: [{source: unparseableRow}]
    })
  })

  it('counts duplicate lemmas', () => {
    expect(parse([entryRow, entryRow])).toEqual(jasmine.objectContaining({
      duplicates: {'lemma I': 2}
    }))
  })
})
