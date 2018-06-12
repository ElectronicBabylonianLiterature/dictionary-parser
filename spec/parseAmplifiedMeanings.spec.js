const extractVowels = require('../lib/extractVowels')

const examples = [
  ['', {}],
  [' **1.** meaning **10.** meaning;', {implicit: {'1.': {meaning: 'meaning'}, '10.': {meaning: 'meaning'}}}],
  [' **G** meaning **1.** meaning **2.** meaning;', {'G': {meaning: 'meaning', '1.': {meaning: 'meaning'}, '2.': {meaning: 'meaning'}}}],
  [' **D** **1.** meaning;', {'D': {'1.': {meaning: 'meaning'}}}],
  [' **A.** meaning **B.** meaning;', {'A.': {meaning: 'meaning'}, 'B.': {meaning: 'meaning'}}],
  [' **A.** "meaning1; meaning2";', {'A.': {meaning: '"meaning1; meaning2"'}}],
  [' **A.** **1.** "meaning1; meaning2";', {'A.': {'1.': {meaning: '"meaning1; meaning2"'}}}],
  [' **1.** MB, NB (meaning) **2.** meaning', {implicit: {'1.': {meaning: 'MB, NB (meaning)'}, '2.': {meaning: 'meaning'}}}],
  [' **G** meaning (*a/u*)', {'G': {meaning: 'meaning (*a/u*)', vowels: extractVowels('meaning (*a/u*)')}}],
  [' **G** **1.** (*a/u*) "meaning";', {'G': {'1.': {meaning: '(*a/u*) "meaning"', vowels: extractVowels('(*a/u*)')}}}]
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
