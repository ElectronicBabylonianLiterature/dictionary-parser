const Entry = require('../lib/Entry')
describe('addRoots', () => {
  const addRoots = require('../lib/addRoots')

  it('adds roots and POS to matching entries', () => {
    const matchingEntry = new Entry('**lemm(a)** meaning').toPlainObject()
    const nonMatchingEntry = new Entry('**other** meaning').toPlainObject()

    expect(addRoots([matchingEntry, nonMatchingEntry], [['lemm(a)', 'lmm']])).toEqual([
      {...matchingEntry, roots: 'lmm', pos: 'V'},
      nonMatchingEntry
    ])
  })
})
