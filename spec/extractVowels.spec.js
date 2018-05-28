const examples = [
  ['meaning', []],
  ['meaning (*a/u*)', [{value: ['a', 'u'], notes: []}]],
  ['meaning (*a/u*, *u/u*, *i/i*)', [
    {value: ['a', 'u'], notes: []},
    {value: ['u', 'u'], notes: []},
    {value: ['i', 'i'], notes: []}
  ]],
  ['meaning (*a/u*, occas. *u/u*)', [
    {value: ['a', 'u'], notes: []},
    {value: ['u', 'u'], notes: ['occas.']}
  ]],
  ['meaning (OB mostly *lemma1*, *lemma2*, *lemma3*, later Bab. *u/u*)', [
    {value: ['u', 'u'], notes: ['OB mostly *lemma1*, *lemma2*, *lemma3*, later Bab.']}
  ]]
  // ['meaning (*a/u*; notes *lemma*)', {'G': {meaning: 'meaning', vowels: ['u', 'a']}}],
  // ['meaning (*a/u*, notes *lemma*)', {'G': {meaning: 'meaning', vowels: ['u', 'a']}}]
  // ['meaning **1.** meaning (*u/a*)', {'G': {meaning: 'meaning', vowels: ['u', 'a']}}]
]

describe('extractVowels', () => {
  const extractVowels = require('../lib/extractVowels')

  examples.forEach(([meaning, expected]) => {
    describe(meaning, () => {
      it('extracts correctly', () => {
        expect(extractVowels(meaning)).toEqual(expected)
      })
    })
  })
})
