const examples = [
  ['', []],
  [' \\> *derived1*?, *derived2*', [[{lemma: ['derived1'], homonym: 'I', notes: ['?']}, {lemma: ['derived2'], homonym: 'I', notes: []}]]],
  [' \\> *derived1*, *derived2*; *derived3*', [[{lemma: ['derived1'], homonym: 'I', notes: []}, {lemma: ['derived2'], homonym: 'I', notes: []}], [{lemma: ['derived3'], homonym: 'I', notes: []}]]],
  [' \\> *derived1* II.VI', [[{lemma: ['derived1'], homonym: 'II', notes: []}, {lemma: ['derived1'], homonym: 'VI', notes: []}]]],
  [' \\> notes *derived* 3', [[{lemma: ['derived'], homonym: 'I', notes: ['notes', '3']}]]],
  [' \\> *cf.* *derived*?', [[{lemma: ['derived'], homonym: 'I', notes: ['*cf.*', '?']}]]],
  [' \\> *part1 part2*', [[{lemma: ['part1', 'part2'], homonym: 'I', notes: []}]]],
  [' \\> *expan(d)*', [[{lemma: ['expan'], homonym: 'I', notes: []}]]]
]

describe('parseDerived', () => {
  const parseDerived = require('../lib/parseDerived')

  examples.forEach(derived => {
    it(`parser ${derived[0]} to ${derived[1]}`, () => {
      expect(parseDerived(derived[0])).toEqual(derived[1])
    })
  })

  it('returns unparseable derived as is', () => {
    const unparseable = 'not a correct derived'
    expect(parseDerived(unparseable)).toEqual([[unparseable]])
  })
})
