describe('parseRow', () => {
    const parseRow = require('../lib/parseRow')
    const row = '**lemma** description'

    it('extracts the lemma correctly', ()=> {
        expect(parseRow(row)).toEqual({
            lemma: 'lemma'
        })
    })
})
