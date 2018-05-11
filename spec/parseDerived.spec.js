const examples = [
  ['', []],
  [' \\> *derived1*?, *derived2*', [[{lemma: 'derived1', homonym: 'I', notes: ['?']}, {lemma: 'derived2', homonym: 'I', notes: []}]]],
  [' \\> *derived1*, *derived2*; *derived3*', [[{lemma: 'derived1', homonym: 'I', notes: []}, {lemma: 'derived2', homonym: 'I', notes: []}], [{lemma: 'derived3', homonym: 'I', notes: []}]]],
  [' \\> *derived1* II.VI', [[{lemma: 'derived1', homonym: 'II', notes: []}, {lemma: 'derived1', homonym: 'VI', notes: []}]]],
  [' \\> *cf.* *derived*', [[{lemma: 'derived', homonym: 'I', notes: ['cf.']}]]],
  [' \\> *cf.* *derived*?', [[{lemma: 'derived', homonym: 'I', notes: ['cf.', '?']}]]]
]

describe('parseDerived', () => {
  const parseDerived = require('../lib/parseDerived')

  examples.forEach(derived => {
    it(`parser ${derived[0]} to ${derived[1]}`, () => {
      expect(parseDerived(derived[0])).toEqual(derived[1])
    })
  })
})
