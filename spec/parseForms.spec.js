const formExamples = [
  ['', []],
  [', *form1*, *form2*', [{lemma: ['form1'], notes: []}, {lemma: ['form2'], notes: []}]],
  [', *form1*', [{lemma: ['form1'], notes: []}]],
  [', *form1*; *form2*', [{lemma: ['form1'], notes: []}, {lemma: ['form2'], notes: []}]],
  [', note1 *form* note2', [{lemma: ['form'], notes: ['note1', 'note2']}]],
  [', \\**form1*', [{lemma: ['*form1'], notes: []}]],
  [', *form1 form2*', [{lemma: ['form1', 'form2'], notes: []}]],
  [', *form(1) form(2)* note', [
    {lemma: ['form', 'form'], notes: ['note']},
    {lemma: ['form1', 'form'], notes: ['note']},
    {lemma: ['form', 'form2'], notes: ['note']},
    {lemma: ['form1', 'form2'], notes: ['note']}
  ]]
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
