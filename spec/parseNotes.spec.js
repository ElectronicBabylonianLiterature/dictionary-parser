describe('parseNotes', () => {
  const parseNotes = require('../lib/parseNotes')

  it('returns specified indices', () => {
    expect(parseNotes(['a', 'c'], {a: 'a', b: 'b', c: 'c'})).toEqual(['a', 'c'])
  })

  it('trims notes', () => {
    expect(parseNotes(['a'], {a: ' a '})).toEqual(['a'])
  })

  it('filters out empty strings', () => {
    expect(parseNotes(['a'], {a: ' '})).toEqual([])
  })

  it('filters out nil values', () => {
    expect(parseNotes(['a', 'b', 'c'], {a: undefined, b: null})).toEqual([])
  })
})
