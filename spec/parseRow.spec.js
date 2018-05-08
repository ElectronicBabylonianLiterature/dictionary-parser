describe('parseRow', () => {
    const parseRow = require('../lib/parseRow')
    const row = '**lemma** description'

    it('extracts the data correctly', ()=> {
        expect(parseRow(row)).toEqual({
            lemma: 'lemma',
            definition: 'description',
            source: row
        })
    })
})
