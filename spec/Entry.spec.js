const parseForms = require('../lib/parseForms')
const parseDerived = require('../lib/parseDerived')

function * cartesian (head, ...tail) {
  // From https://stackoverflow.com/a/44344803
  let remainder = tail.length ? cartesian(...tail) : [[]]
  for (let r of remainder) for (let h of head) yield [h, ...r]
}

describe('Entry', () => {
  const Entry = require('../lib/Entry')

  const lemmaExamples = [
    ['**lemma**', 'lemma'],
    ['***lemma***', 'lemma'],
    ['**\\*lemma**', '*lemma'],
    ['***\\*lemma***', '*lemma']
  ]

  const homonymExamples = [
    ['', 'I'],
    [' II', 'II'],
    [' VII', 'VII']
  ]

  const formExamples = [
    '',
    ', *form1*, *form2*',
    ', *form1*',
    ', *form1*; *form2*',
    ', note *form*'
  ]

  const definitionExamples = [
    '"definition"',
    '\'definition\'',
    '(definition)',
    '**\\~** definition',
    '**1.** conjugation'
  ]

  const derivedExamples = [
    '',
    ' \\> *derived1*?, *derived2*',
    ' \\> *derived1*, *derived2*; *derived3*',
    ' \\> *derived1* II.VI',
    ' \\> *cf.* *derived*',
    ' \\> *cf.* *derived*?'
  ]

  const derivedFromExamples = [
    ['', null],
    [' \\< *derivedFrom*', 'derivedFrom']
  ]

  for (const [lemma, homonym, forms, definition, derived, derivedFrom] of cartesian(
    lemmaExamples,
    homonymExamples,
    formExamples,
    definitionExamples,
    derivedExamples,
    derivedFromExamples
  )) {
    const row = `${lemma[0]}${homonym[0]}${forms} ${definition}${derived}${derivedFrom[0]}`

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

      it('parses definition correctly', () => {
        expect(entry.definition).toEqual(definition)
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
    })
  }

  describe('special cases', () => {
    describe('lemma and tilde with shared bold', () => {
      const row = '**lemma \\~** "definition"'
      const entry = new Entry(row)

      it('parses lemma correctly', () => {
        expect(entry.lemma).toEqual('lemma')
      })

      it('parses definition correctly', () => {
        expect(entry.definition).toEqual('"definition"')
      })
    })

    describe('derived after derived from', () => {
      const row = '**lemma** "definition"; \\< *derivedFrom*; \\> *derived*'
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
  })
})
