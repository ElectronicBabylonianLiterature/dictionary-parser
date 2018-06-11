const Entry = require('../lib/Entry')

describe('checkDerived', () => {
  const checkDerived = require('../lib/checkDerived')

  it('does not list derived if it matches lemma', () => {
    const entry = new Entry('**part1 part2** meaning \\> *matchlemma*').toPlainObject()
    const matchLemma = new Entry('**matchlemma** meaning').toPlainObject()

    expect(checkDerived([entry, matchLemma])).toEqual([])
  })

  it('does not list derived if it matches form', () => {
    const entry = new Entry('**part1 part2** meaning \\> *matchform part*').toPlainObject()
    const matchForm = new Entry('**other**, *matchform part* meaning').toPlainObject()

    expect(checkDerived([entry, matchForm])).toEqual([])
  })

  it('maps unmatched derived forms by entry lemma', () => {
    const entry = new Entry('**part1 part2** meaning \\> *missing*').toPlainObject()
    const unmatchedHomonym = new Entry('**other** meaning').toPlainObject()

    expect(checkDerived([entry, unmatchedHomonym])).toEqual([
      'part1 part2: missing'
    ])
  })

  it('list derived form if homonym is not mathced', () => {
    const entry = new Entry('**part1 part2** meaning \\> *missing*').toPlainObject()
    const unmatchedHomonym = new Entry('**missing** II meaning').toPlainObject()

    expect(checkDerived([entry, unmatchedHomonym])).toEqual([
      'part1 part2: missing'
    ])
  })

  it('ignores derived forms from links', () => {
    const entry = new Entry('**lemma** meaning \\> *link*').toPlainObject()
    entry.derived[0][0].source = '**link** *cf.* *lemma*'

    expect(checkDerived([entry])).toEqual([])
  })

  it('ignores broken derived forms', () => {
    const entry = new Entry('**lemma** meaning \\> broken').toPlainObject()

    expect(checkDerived([entry])).toEqual([])
  })
})
