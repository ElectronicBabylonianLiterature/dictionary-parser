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

  const definitionExamples = [
    '"definition"',
    '(definition)',
    '**\\~** definition'
  ]

  const derivedExamples = [
    ['', []],
    [' \\> *derived1*?, *derived2*', [[{lemma: 'derived1', homonym: null, notes: '?'}, {lemma: 'derived2', homonym: null, notes: ''}]]],
    [' \\> *derived1*, *derived2*; *derived3*', [[{lemma: 'derived1', homonym: null, notes: ''}, {lemma: 'derived2', homonym: null, notes: ''}], [{lemma: 'derived3', homonym: null, notes: ''}]]],
    [' \\> *derived1* I.VI', [[{lemma: 'derived1', homonym: 'I.VI', notes: ''}]]]
  ]

  for (const [lemma, homonym, forms, definition, derived] of cartesian(
    lemmaExamples,
    homonymExamples,
    formExamples,
    definitionExamples,
    derivedExamples
  )) {
    const row = `${lemma[0]}${homonym[0]}${forms[0]} ${definition}${derived[0]}`

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

      it('parses derived correctly', () => {
        expect(entry.derived).toEqual(derived[1])
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
  })
})
