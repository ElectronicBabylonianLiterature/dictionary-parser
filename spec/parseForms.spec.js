const formExamples = [
  ['', []],
  [', *form1*, *form2*', ['form1', 'form2']],
  [', *form1*', ['form1']]
]

describe('parseDerived', () => {
  const parseForms = require('../lib/parseForms')

  formExamples.forEach(form => {
    it(`parser ${form[0]} to ${form[1]}`, () => {
      expect(parseForms(form[0])).toEqual(form[1])
    })
  })
})
