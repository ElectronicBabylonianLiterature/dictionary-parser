const extractVowels = require('../lib/extractVowels')

const examples = [
  ['', {}],
  [' **1.** meaning **10.** meaning;', {
    implicit: {meaning: '', vowels: [], entries: [{meaning: 'meaning', vowels: []}, {meaning: 'meaning', vowels: []}]}
  }],
  [' **G** meaning **1.** meaning **2.** meaning;', {
    'G': {meaning: 'meaning', vowels: [], entries: [{meaning: 'meaning', vowels: []}, {meaning: 'meaning', vowels: []}]}
  }],
  [' **D** **1.** meaning;', {
    'D': {meaning: '', vowels: [], entries: [{meaning: 'meaning', vowels: []}]}
  }],
  [' **A.** meaning **B.** meaning;', {
    'A.': {meaning: 'meaning', vowels: [], entries: []},
    'B.': {meaning: 'meaning', vowels: [], entries: []}
  }],
  [' **A.** "meaning1; meaning2";', {
    'A.': {meaning: '"meaning1; meaning2"', vowels: [], entries: []}
  }],
  [' **A.** **1.** "meaning1; meaning2";', {
    'A.': {meaning: '', vowels: [], entries: [{meaning: '"meaning1; meaning2"', vowels: []}]}
  }],
  [' **1.** MB, NB (meaning) **2.** meaning', {
    implicit: {meaning: '', vowels: [], entries: [{meaning: 'MB, NB (meaning)', vowels: []}, {meaning: 'meaning', vowels: []}]}
  }],
  [' **G** meaning (*a/u*)', {
    'G': {meaning: 'meaning (*a/u*)', vowels: extractVowels('meaning (*a/u*)'), entries: []}
  }],
  [' **G** **1.** (*a/u*) "meaning";', {
    'G': {meaning: '', vowels: [], entries: [{meaning: '(*a/u*) "meaning"', vowels: extractVowels('(*a/u*)')}]}
  }]
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
