describe('parseRow', () => {
  const parseRow = require('../lib/parseRow')

  const examples = [
    {name: 'lemma', row: '**lemma** "definition"'},
    {name: 'italic lemma', row: '***lemma*** "definition"'},
    {name: 'lemma with asterisk', row: '**\\*lemma** "definition"', lemma: '*lemma'},
    {name: 'italic lemma with asterisk', row: '**\\*lemma** "definition"', lemma: '*lemma'},
    {name: 'homonym', row: '**lemma** II "definition"', homonym: 'II'},
    {name: 'forms', row: '**lemma**, *form1*, *form2* "definition"', forms: ', *form1*, *form2*'},
    {name: 'homonym + forms', row: '**lemma** IV, *form1* "definition"', forms: ', *form1*', homonym: 'IV'}
  ]

  examples.forEach(({name, row, lemma = 'lemma', homonym = 'I', forms = '', definition = '"definition"'}) => {
    it(`extracts the data correctly from ${name}`, () => {
      expect(parseRow(row)).toEqual({
        lemma: lemma,
        homonym: homonym,
        forms: forms,
        definition: definition,
        source: row
      })
    })
  })
})
