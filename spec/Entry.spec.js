describe('Entry', () => {
  const Entry = require('../lib/Entry')

  const definitions = [
    '"definition"',
    '(definition)',
    '**\\~** definition'
  ]

  definitions.forEach(definition => {
    const examples = [
      {name: 'lemma', row: `**lemma** ${definition}`},
      {name: 'italic lemma', row: `***lemma*** ${definition}`},
      {name: 'lemma with asterisk', row: `**\\*lemma** ${definition}`, lemma: '*lemma'},
      {name: 'italic lemma with asterisk', row: `**\\*lemma** ${definition}`, lemma: '*lemma'},
      {name: 'homonym', row: `**lemma** II ${definition}`, homonym: 'II'},
      {name: 'forms', row: `**lemma**, *form1*, *form2* ${definition}`, forms: ', *form1*, *form2*'},
      {name: 'homonym + forms', row: `**lemma** IV, *form1* ${definition}`, forms: ', *form1*', homonym: 'IV'}
    ]

    examples.forEach(({name, row, lemma = 'lemma', homonym = 'I', forms = ''}) => {
      describe(`row is: ${row}`, () => {
        const entry = new Entry(row)

        it('parses lemma correctly', () => {
          expect(entry.lemma).toEqual(lemma)
        })
        it('parses homonym correctly', () => {
          expect(entry.homonym).toEqual(homonym)
        })
        it('parses forms correctly', () => {
          expect(entry.forms).toEqual(forms)
        })
        it('parses definition correctly', () => {
          expect(entry.definition).toEqual(definition)
        })
        it('sets source to original row', () => {
          expect(entry.source).toEqual(row)
        })
      })
    })
  })
})
