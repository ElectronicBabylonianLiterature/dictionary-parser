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
    ['', []],
    [', *form1*, *form2*', ['form1', 'form2']],
    [', *form1*', ['form1']]
  ]

  const definitions = [
    '"definition"',
    '(definition)',
    '**\\~** definition'
  ]

  for (const [lemma, homonym, forms, definition] of cartesian(lemmaExamples, homonymExamples, formExamples, definitions)) {
    const row = `${lemma[0]}${homonym[0]}${forms[0]} ${definition}`

    describe(`row is: ${row}`, () => {
      const entry = new Entry(row)

      it('parses lemma correctly', () => {
        expect(entry.lemma).toEqual(lemma[1])
      })
      it('parses homonym correctly', () => {
        expect(entry.homonym).toEqual(homonym[1])
      })
      it('parses forms correctly', () => {
        expect(entry.forms).toEqual(forms[1])
      })
      it('parses definition correctly', () => {
        expect(entry.definition).toEqual(definition)
      })
      it('sets source to original row', () => {
        expect(entry.source).toEqual(row)
      })
    })
  }
})
