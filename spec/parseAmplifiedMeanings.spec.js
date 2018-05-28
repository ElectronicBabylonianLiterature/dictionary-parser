const examples = [
  ['', {}],
  [' **1.** meaning **2.** meaning;', {implicit: {'1.': 'meaning', '2.': 'meaning'}}],
  [' **G** meaning **1.** meaning **2.** meaning;', {'G': {meaning: 'meaning', '1.': 'meaning', '2.': 'meaning'}}],
  [' **D** **1.** meaning;', {'D': {'1.': 'meaning'}}],
  [' **A.** meaning **B.** meaning;', {'A.': {meaning: 'meaning'}, 'B.': {meaning: 'meaning'}}],
  [' **A.** "meaning1; meaning2";', {'A.': {meaning: '"meaning1; meaning2"'}}],
  [' **A.** **1.** "meaning1; meaning2";', {'A.': {'1.': '"meaning1; meaning2"'}}],
  [' **1.** MB, NB (meaning) **2.** meaning', {implicit: {'1.': 'MB, NB (meaning)', '2.': 'meaning'}}],
  [' **G** meaning (*a/u*)', {'G': {meaning: 'meaning (*a/u*)', vowels: [{value: ['a', 'u'], notes: []}]}}],
  [' **G** meaning (*a/u*, *u/u*, *i/i*)',
    {'G': {
      meaning: 'meaning (*a/u*, *u/u*, *i/i*)',
      vowels: [
        {value: ['a', 'u'], notes: []},
        {value: ['u', 'u'], notes: []},
        {value: ['i', 'i'], notes: []}
      ]
    }}
  ],
  [' **G** meaning (*a/u*, occas. *u/u*)',
    {'G': {
      meaning: 'meaning (*a/u*, occas. *u/u*)',
      vowels: [
        {value: ['a', 'u'], notes: []},
        {value: ['u', 'u'], notes: ['occas.']}
      ]
    }}
  ],
  [' **G** meaning (OB mostly *lemma1*, *lemma2*, *lemma3*, later Bab. *u/u*)',
    {'G': {
      meaning: 'meaning (OB mostly *lemma1*, *lemma2*, *lemma3*, later Bab. *u/u*)',
      vowels: [
        {value: ['u', 'u'], notes: ['OB mostly *lemma1*, *lemma2*, *lemma3*, later Bab.']}
      ]
    }}
  ]
]

describe('parseAmplifiedMeanings', () => {
  const parseAmplifiedMeanings = require('../lib/parseAmplifiedMeanings')

  examples.forEach(([nestedMeaning, expected]) => {
    describe(nestedMeaning, () => {
      it('parses correctly', () => {
        expect(parseAmplifiedMeanings(nestedMeaning)).toEqual(expected)
      })
    })
  })
})
