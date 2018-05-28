const extractVowels = require('../lib/extractVowels')

const examples = [
  ['', {}],
  [' **1.** meaning **2.** meaning;', {implicit: {'1.': 'meaning', '2.': 'meaning'}}],
  [' **G** meaning **1.** meaning **2.** meaning;', {'G': {meaning: 'meaning', '1.': 'meaning', '2.': 'meaning'}}],
  [' **D** **1.** meaning;', {'D': {'1.': 'meaning'}}],
  [' **A.** meaning **B.** meaning;', {'A.': {meaning: 'meaning'}, 'B.': {meaning: 'meaning'}}],
  [' **A.** "meaning1; meaning2";', {'A.': {meaning: '"meaning1; meaning2"'}}],
  [' **A.** **1.** "meaning1; meaning2";', {'A.': {'1.': '"meaning1; meaning2"'}}],
  [' **1.** MB, NB (meaning) **2.** meaning', {implicit: {'1.': 'MB, NB (meaning)', '2.': 'meaning'}}],
  [' **G** meaning (*a/u*)', {'G': {meaning: 'meaning (*a/u*)', vowels: extractVowels('meaning (*a/u*)')}}]
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
