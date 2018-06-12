const Entry = require('../lib/Entry')
describe('addRoots', () => {
  const addRoots = require('../lib/addRoots')

  it('adds roots without homonym and POS to matching entries with homonym ', () => {
    const matchingEntry = new Entry('**lemmum** meaning').toPlainObject()
    const nonMatchingEntry = new Entry('**other** meaning').toPlainObject()

    expect(addRoots([matchingEntry, nonMatchingEntry], [['lemmu(m)', 'lmm']])).toEqual({
      entries: [
        {...matchingEntry, roots: ['lmm'], pos: 'V'},
        {...nonMatchingEntry, pos: ''}
      ],
      unmatchedRoots: []
    })
  })

  it('adds all roots', () => {
    const matchingEntry = new Entry('**lemmu** meaning').toPlainObject()

    expect(addRoots([matchingEntry], [['lemmu(m)', 'root1'], ['lemmu', 'root2']])).toEqual({
      entries: [
        {...matchingEntry, roots: ['root1', 'root2'], pos: 'V'}
      ],
      unmatchedRoots: []
    })
  })

  it('adds unique roots', () => {
    const matchingEntry = new Entry('**lemmu** meaning').toPlainObject()

    expect(addRoots([matchingEntry], [['lemmu(m)', 'root'], ['lemmu', 'root']])).toEqual({
      entries: [
        {...matchingEntry, roots: ['root'], pos: 'V'}
      ],
      unmatchedRoots: []
    })
  })

  it('adds roots with homonym and POS to matching entries', () => {
    const matchingEntry1 = new Entry('**lemma** II meaning').toPlainObject()
    const matchingEntry2 = new Entry('**lemma** IV meaning').toPlainObject()
    const nonMatchingEntry = new Entry('**lemma** III meaning').toPlainObject()

    expect(addRoots([matchingEntry1, matchingEntry2, nonMatchingEntry], [['lemma II.IV', 'lmm']])).toEqual({
      entries: [
        {...matchingEntry1, roots: ['lmm'], pos: 'V'},
        {...matchingEntry2, roots: ['lmm'], pos: 'V'},
        {...nonMatchingEntry, pos: ''}
      ],
      unmatchedRoots: []
    })
  })

  it('lists unmacthed roots', () => {
    const nonMatchingEntry = new Entry('**lemma** III meaning').toPlainObject()

    expect(addRoots([nonMatchingEntry], [['lemma', 'lmm']])).toEqual({
      entries: [
        {...nonMatchingEntry, pos: ''}
      ],
      unmatchedRoots: ['lemma, lmm']
    })
  })
})
