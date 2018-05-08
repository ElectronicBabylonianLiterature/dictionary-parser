describe('parseRow', () => {
  const parseRow = require('../lib/parseRow')

  const examples = [
    {name: 'lemma', row: '**lemma** description', expected: 'lemma'},
    {name: 'italic lemma', row: '***lemma*** description', expected: 'lemma'},
    {name: 'lemma with asterisk', row: '**\\*lemma** description', expected: '\\*lemma'},
    {name: 'italic lemma with asterisk', row: '**\\*lemma** description', expected: '\\*lemma'}
  ]

  examples.forEach(({name, row, expected}) => {
    it(`extracts the data correctly from ${name}`, () => {
      expect(parseRow(row)).toEqual({
        lemma: expected,
        definition: 'description',
        source: row
      })
    })
  })
})
