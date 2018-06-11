const formExamples = [
  ['', []],
  [', *form1*, *form2*', [{lemma: ['form1'], attested: true, notes: []}, {lemma: ['form2'], attested: true, notes: []}]],
  [', *form1*', [{lemma: ['form1'], attested: true, notes: []}]],
  [', *form1*; *form2*', [{lemma: ['form1'], attested: true, notes: []}, {lemma: ['form2'], attested: true, notes: []}]],
  [', note1 *form* note2', [{lemma: ['form'], attested: true, notes: ['note1', 'note2']}]],
  [', \\**form1*', [{lemma: ['form1'], attested: false, notes: []}]],
  [', *form1 form2*', [{lemma: ['form1', 'form2'], attested: true, notes: []}]],
  [', *form(1) form(2)* note', [
    {lemma: ['form', 'form'], attested: true, notes: ['note']},
    {lemma: ['form1', 'form'], attested: true, notes: ['note']},
    {lemma: ['form', 'form2'], attested: true, notes: ['note']},
    {lemma: ['form1', 'form2'], attested: true, notes: ['note']}
  ]],
  [', OAkk, MB *form1*', [{lemma: ['form1'], attested: true, notes: ['OAkk, MB']}]],
  [', Am., Bogh. *form1*', [{lemma: ['form1'], attested: true, notes: ['Am., Bogh.']}]],
  [', NB?, NA *form1*', [{lemma: ['form1'], attested: true, notes: ['NB?, NA']}]],
  [', (or *form*)', [{lemma: ['form'], attested: true, notes: ['(or', ')']}]]
]

describe('parseForms', () => {
  const parseForms = require('../lib/parseForms')

  formExamples.forEach(form => {
    it(`parser ${form[0]} to ${form[1]}`, () => {
      expect(parseForms(form[0])).toEqual(form[1])
    })
  })

  it('returns unparseable form as is', () => {
    const unparseable = 'not a correct form'
    expect(parseForms(unparseable)).toEqual([unparseable])
  })
})
