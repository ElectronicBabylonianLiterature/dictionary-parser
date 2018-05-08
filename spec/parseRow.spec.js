describe('parseRow', () => {
  const parseRow = require('../lib/parseRow')

  const examples = [
    {name: 'lemma', row: '**lemma** description'},
    {name: 'italic lemma', row: '***lemma*** description'},
    {name: 'lemma with asterisk', row: '**\\*lemma** description', lemma: '\\*lemma'},
    {name: 'italic lemma with asterisk', row: '**\\*lemma** description', lemma: '\\*lemma'},
    {name: 'homonym', row: '**lemma** II description', homonym: 'II'}
  ]

  examples.forEach(({name, row, lemma = 'lemma', definition = 'description', homonym = 'I'}) => {
    it(`extracts the data correctly from ${name}`, () => {
      expect(parseRow(row)).toEqual({
        lemma: lemma,
        homonym: homonym,
        definition: definition,
        source: row
      })
    })
  })
})
