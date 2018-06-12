const Entry = require('../lib/Entry')
describe('addRoots', () => {
  const addRoots = require('../lib/addRoots')

  it('adds roots without homonym and POS to matching entries with homonym ', () => {
    const matchingEntry = new Entry('**lemm(a)** meaning').toPlainObject()
    const nonMatchingEntry = new Entry('**other** meaning').toPlainObject()

    expect(addRoots([matchingEntry, nonMatchingEntry], [['lemm(a)', 'lmm']])).toEqual([
      {...matchingEntry, root: 'lmm', pos: 'V'},
      nonMatchingEntry
    ])
  })

  it('adds roots with homonym and POS to matching entries', () => {
    const matchingEntry1 = new Entry('**lemma** II meaning').toPlainObject()
    const matchingEntry2 = new Entry('**lemma** IV meaning').toPlainObject()
    const nonMatchingEntry = new Entry('**lemma** III meaning').toPlainObject()

    expect(addRoots([matchingEntry1, matchingEntry2, nonMatchingEntry], [['lemma II.IV', 'lmm']])).toEqual([
      {...matchingEntry1, root: 'lmm', pos: 'V'},
      {...matchingEntry2, root: 'lmm', pos: 'V'},
      nonMatchingEntry
    ])
  })
})
