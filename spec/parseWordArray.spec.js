const parseWordArray = require('../lib/parseWordArray')

describe('parseWordArray', () => {
  it('splits by given separator', () => {
    expect(parseWordArray('foo;bar;baz', ';', '')).toEqual(['foo', 'bar', 'baz'])
  })

  it('trims given characters', () => {
    expect(parseWordArray('*#fo*o#', ';', '#*')).toEqual(['fo*o'])
  })
})
