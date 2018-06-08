const Link = require('../lib/Link')
const Entry = require('../lib/Entry')

function expectDerivedToContainLink (merged, entry, link) {
  expect(merged).toEqual({
    entries: [{
      ...entry.toPlainObject(),
      derived: [[{
        lemma: link.lemmas[0],
        homonym: 'I',
        notes: [],
        source: link.source
      }]]
    }],
    unlinked: []
  })
}

describe('mergeLinks', () => {
  const mergeLinks = require('../lib/mergeLinks')

  it('adds links as derived forms', () => {
    const link = new Link('**link** *cf.* *matchinglemma*')
    const matchingEntry = new Entry('**matchinglemma** meaning')

    const merged = mergeLinks([matchingEntry], [link])

    expectDerivedToContainLink(merged, matchingEntry, link)
  })

  it('adds source of links without matching entries to unlinked', () => {
    const link = new Link('**link** *cf.* *matchinglemma*')
    const notMatchingEntry = new Entry('**notMatchinglemma** meaning')

    const merged = mergeLinks([notMatchingEntry], [link])

    expect(merged).toEqual({
      entries: [notMatchingEntry.toPlainObject()],
      unlinked: [link.source]
    })
  })

  it('links if target is in forms', () => {
    const link = new Link('**link** *cf.* *matchinglemma*')
    const matchingEntry = new Entry('**lemma**, *matchinglemma* meaning')

    const merged = mergeLinks([matchingEntry], [link])

    expectDerivedToContainLink(merged, matchingEntry, link)
  })

  it('ignores dash at end of lemma', () => {
    const link = new Link('**link** *cf.* *matchinglemma*')
    const matchingEntry = new Entry('**matchinglemma-** meaning')

    const merged = mergeLinks([matchingEntry], [link])

    expectDerivedToContainLink(merged, matchingEntry, link)
  })

  it('... adds link with replaced prefix', () => {
    const link = new Link('**link...** *cf.* *matching...*')
    const matchingEntry = new Entry('**matchinglemma** meaning')

    const merged = mergeLinks([matchingEntry], [link])

    expect(merged).toEqual({
      entries: [{
        ...matchingEntry.toPlainObject(),
        derived: [[{
          lemma: ['linklemma'],
          homonym: 'I',
          notes: [],
          source: link.source
        }]]
      }],
      unlinked: []
    })
  })
})
