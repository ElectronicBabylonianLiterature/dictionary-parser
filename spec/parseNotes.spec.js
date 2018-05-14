describe('parseNotes', () => {
  const parseNotes = require('../lib/parseNotes')

  it('returns specified indices', () => {
    expect(parseNotes([0, 2], ['a', 'b', 'c'])).toEqual(['a', 'c'])
  })

  it('trims notes', () => {
    expect(parseNotes([0], [' a '])).toEqual(['a'])
  })

  it('filters out empty strings', () => {
    expect(parseNotes([0], [' '])).toEqual([])
  })

  it('filters out nil values', () => {
    expect(parseNotes([0, 1], [undefined, null])).toEqual([])
  })
})
