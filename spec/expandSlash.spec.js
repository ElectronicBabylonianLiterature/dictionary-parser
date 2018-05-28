const expandSlash = require('../lib/expandSlash.js')

describe('expandSlash', () => {
  it('generates all the forms when one slash', () => {
    expect(expandSlash('abc/d')).toEqual(jasmine.arrayWithExactContents(['abc', 'abd']))
  })

  it('generates all the forms when multiple slashes', () => {
    expect(expandSlash('a/bc/d')).toEqual(jasmine.arrayWithExactContents(['ac', 'ad', 'bc', 'bd']))
  })

  it('returns the original if no slashes', () => {
    expect(expandSlash('abc')).toEqual(['abc'])
  })
})
