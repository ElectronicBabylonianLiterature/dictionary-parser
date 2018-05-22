describe('extractLogograms', () => {
  const extractLogograms = require('../lib/extractLogograms')

  it('parses no logograms to an empty array', () => {
    expect(extractLogograms('some text')).toEqual([])
  })

  it('parses non logogram square brackets to an empty array', () => {
    expect(extractLogograms('some *lem\\[ma\\]*')).toEqual([])
  })

  it('parses only notes logograms', () => {
    expect(extractLogograms('\\[*cf.* also *lemma* 2\\]')).toEqual([{logogram: [], notes: ['*cf.* also *lemma* 2']}])
  })

  it('parses a single logogram', () => {
    expect(extractLogograms('some text \\[LÚ.DIN\\] some more text')).toEqual([{logogram: ['LÚ.DIN'], notes: []}])
  })

  it('parses a multiple logograms', () => {
    expect(extractLogograms('some text \\[NA LÚ.DIN\\] some more text')).toEqual([{logogram: ['NA', 'LÚ.DIN'], notes: []}])
  })

  it('parses a multiple logograms', () => {
    expect(extractLogograms('some text \\[NA LÚ.DIN\\] some more text')).toEqual([{logogram: ['NA', 'LÚ.DIN'], notes: []}])
  })

  it('parses an alternate logograms', () => {
    expect(extractLogograms('some text \\[ŠITIM; NA LÚ.DIN\\] some more text')).toEqual([{logogram: ['ŠITIM'], notes: []}, {logogram: ['NA', 'LÚ.DIN'], notes: []}])
  })

  it('parses a logogram with note', () => {
    expect(extractLogograms('\\[some. *lemma* Note LÚ.DIN Another. *cf.* note ?\\]')).toEqual([{logogram: ['LÚ.DIN'], notes: ['some. *lemma* Note', 'Another. *cf.* note ?']}])
  })

  it('parses a logogram with note starting with capitals', () => {
    expect(extractLogograms('\\[NB also NINDA.HI.A\\]')).toEqual([{logogram: ['NINDA.HI.A'], notes: ['NB also']}])
  })

  it('parses a logogram with space within parenhesis', () => {
    expect(extractLogograms('\\[ÌR(- )\\]')).toEqual([{logogram: ['ÌR(- )'], notes: []}])
  })
})
