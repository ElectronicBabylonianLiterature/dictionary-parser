const parseForms = require('../lib/parseForms')
const parseDerived = require('../lib/parseDerived')
const parseAmplifiedMeanings = require('../lib/parseAmplifiedMeanings')

function * cartesian (head, ...tail) {
  // From https://stackoverflow.com/a/44344803
  let remainder = tail.length ? cartesian(...tail) : [[]]
  for (let r of remainder) for (let h of head) yield [h, ...r]
}

describe('Entry', () => {
  const Entry = require('../lib/Entry')

  const lemmaExamples = [
    ['**lemma**', ['lemma']],
    ['***lemma***', ['lemma']],
    ['***\\*lemma***', ['*lemma']],
    ['**lemma \\*lemma**', ['lemma', '*lemma']]
  ]

  const homonymExamples = [
    ['', 'I'],
    [' VII', 'VII']
  ]

  const formExamples = [
    '',
    ', *form1*, note *form2*; \\**form3*'
  ]

  const meaningExamples = [
    '"meaning1, meaning2" *italic* "meaning3"',
    '\'meaning\'',
    '(meaning)',
    'meaning',
    '? "meaning"',
    '\\~ "meaning"',
    ''
  ]

  const amplifiedMeaningsExamples = [
    '',
    ' **1.** "meaning1; meaning2" **2.** meaning;',
    ' **G** meaning **D**  "meaning1; meaning2" **1.** meaning **2.** meaning **D** **1.** meaning;'
  ]

  const derivedExamples = [
    '',
    ' \\> *derived1*?, *derived2 II.VI*; *cf.* *derived3*'
  ]

  const derivedFromExamples = [
    ['', null],
    [' \\< *derivedFrom*', 'derivedFrom']
  ]

  for (const [lemma, homonym, forms, meaning, amplifiedMeanings, derived, derivedFrom] of cartesian(
    lemmaExamples,
    homonymExamples,
    formExamples,
    meaningExamples,
    amplifiedMeaningsExamples,
    derivedExamples,
    derivedFromExamples
  )) {
    const row = `${lemma[0]}${homonym[0]}${forms} ${meaning}${amplifiedMeanings}${derived}${derivedFrom[0]}`

    describe(`row is: ${row}`, () => {
      const entry = new Entry(row)

      it('parses lemma correctly', () => {
        expect(entry.lemma).toEqual(lemma[1])
      })

      it('parses homonym correctly', () => {
        expect(entry.homonym).toEqual(homonym[1])
      })

      it('parses forms correctly', () => {
        expect(entry.forms).toEqual(parseForms(forms))
      })

      it('parses meaning correctly', () => {
        expect(entry.meaning).toEqual(meaning)
      })

      it('parses amplified meanings correctly', () => {
        expect(entry.amplifiedMeanings).toEqual(parseAmplifiedMeanings(amplifiedMeanings))
      })

      it('parses derived correctly', () => {
        expect(entry.derived).toEqual(parseDerived(derived))
      })

      it('parses derived from correctly', () => {
        expect(entry.derivedFrom).toEqual(derivedFrom[1])
      })

      it('sets source to original row', () => {
        expect(entry.source).toEqual(row)
      })

      it('is not a link', () => {
        expect(entry.isLink).toEqual(false)
      })
    })
  }

  describe('special cases', () => {
    describe('derived after derived from', () => {
      const row = '**lemma** "meaning"; \\< *derivedFrom*; \\> *derived*'
      const entry = new Entry(row)

      it('parses derived correctly', () => {
        expect(entry.derived).toEqual([[{
          lemma: 'derived',
          homonym: 'I',
          notes: []
        }]])
      })

      it('parses derived from correctly', () => {
        expect(entry.derivedFrom).toEqual('derivedFrom')
      })
    })

    describe('semicolon after emma', () => {
      const row = '**lemma**; meaning'
      const entry = new Entry(row)

      it('parses lemma correctly', () => {
        expect(entry.lemma).toEqual(['lemma'])
      })

      it('parses meaning correctly', () => {
        expect(entry.meaning).toEqual('meaning')
      })
    })

    describe('links', () => {
      describe('plain', () => {
        const row = '**\\*source** *cf.* *target*'
        const entry = new Entry(row)

        it('is link', () => {
          expect(entry.isLink).toEqual(true)
        })
      })

      describe('with note', () => {
        const row = '**\\*source** *cf.* *target* note'
        const entry = new Entry(row)

        it('is link', () => {
          expect(entry.isLink).toEqual(true)
        })
      })

      describe('without italics', () => {
        const row = '**\\*source** *cf.* *target'
        const entry = new Entry(row)

        it('is link', () => {
          expect(entry.isLink).toEqual(true)
        })
      })

      describe('with extra information', () => {
        const row = '**source** *cf.* *target* extra'
        const entry = new Entry(row)

        it('is link', () => {
          expect(entry.isLink).toEqual(true)
        })
      })

      describe('with also', () => {
        const row = '**source** *cf.* also *target*'
        const entry = new Entry(row)

        it('is link', () => {
          expect(entry.isLink).toEqual(true)
        })
      })

      describe('with multiple lemmas', () => {
        const row = '**source**, **source2** *cf.* *target*'
        const entry = new Entry(row)

        it('is link', () => {
          expect(entry.isLink).toEqual(true)
        })
      })

      describe('with multiple lemmas without commas', () => {
        const row = '**source1** **source2** *cf.* *target*'
        const entry = new Entry(row)

        it('is link', () => {
          expect(entry.isLink).toEqual(true)
        })
      })

      describe('with etc. befofe *cf.*', () => {
        const row = '**source** etc. *cf.* *target*'
        const entry = new Entry(row)

        it('is link', () => {
          expect(entry.isLink).toEqual(true)
        })
      })
    })
  })
})
