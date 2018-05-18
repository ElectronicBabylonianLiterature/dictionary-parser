describe('extractLogograms', () => {
  const extractLogograms = require('../lib/extractLogograms')

  it('parses no logograms to and empty array', () => {
    expect(extractLogograms('some text')).toEqual([])
  })

  it('parses a single logogram', () => {
    expect(extractLogograms('some text \\[LÚ.DIN\\] some more text')).toEqual([['LÚ.DIN']])
  })

  it('parses a multiple logograms', () => {
    expect(extractLogograms('some text \\[NA LÚ.DIN\\] some more text')).toEqual([['NA', 'LÚ.DIN']])
  })

  it('parses a multiple logograms', () => {
    expect(extractLogograms('some text \\[NA LÚ.DIN\\] some more text')).toEqual([['NA', 'LÚ.DIN']])
  })

  it('parses an alternate logograms', () => {
    expect(extractLogograms('some text \\[ŠITIM; NA LÚ.DIN\\] some more text')).toEqual([['ŠITIM'], ['NA', 'LÚ.DIN']])
  })
})
