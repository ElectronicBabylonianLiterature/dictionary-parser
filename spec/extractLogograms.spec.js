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

  it('parses a logogram with numbers', () => {
    expect(extractLogograms('\\[IR11\\]')).toEqual([{logogram: ['IR11'], notes: []}])
  })

  it('parses an alternate logograms', () => {
    expect(extractLogograms('some text \\[ŠITIM; LÚ.DIN\\] some more text')).toEqual([{logogram: ['ŠITIM'], notes: []}, {logogram: ['LÚ.DIN'], notes: []}])
  })

  it('parses a logogram with note', () => {
    expect(extractLogograms('\\[some. *lemma* Note LÚ.DIN Another. *cf.* note ?\\]')).toEqual([{logogram: ['LÚ.DIN'], notes: ['some. *lemma* Note', 'Another. *cf.* note ?']}])
  })

  it('parses a logogram with note starting with capitals', () => {
    expect(extractLogograms('\\[NB also NINDA.HI.A\\]')).toEqual([{logogram: ['NINDA.HI.A'], notes: ['NB also']}])
  })

  it('expands parentheses', () => {
    expect(extractLogograms('\\[note LÚ(.DIN)\\]')).toEqual(jasmine.arrayWithExactContents([{logogram: ['LÚ', 'LÚ.DIN'], notes: ['note']}]))
  })

  describe('periods of attestation', () => {
    ['OB', 'MB', 'NB', 'OA', 'MA', 'NA'].forEach(period => {
      it(`parses a logogram starting with ${period}`, () => {
        expect(extractLogograms(`\\[${period} NINDA.HI.A\\]`)).toEqual([{logogram: ['NINDA.HI.A'], notes: [period]}])
      })
    })
  })
})
