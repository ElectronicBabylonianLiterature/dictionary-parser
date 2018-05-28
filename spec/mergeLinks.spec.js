const Link = require('../lib/Link')
const Entry = require('../lib/Entry')

function expectDerivedToContainLink (merged, entry, link) {
  expect(merged).toEqual([{
    ...entry.toPlainObject(),
    derived: [{
      lemma: link.lemmas[0],
      homonym: 'I',
      notes: [],
      source: link.source
    }]
  }])
}

describe('mergeLinks', () => {
  const mergeLinks = require('../lib/mergeLinks')

  it('adds links as derived forms', () => {
    const link = new Link('**link** *cf.* *matchinglemma*')
    const matchingEntry = new Entry('**matchinglemma** meaning')

    const merged = mergeLinks([matchingEntry], [link])

    expectDerivedToContainLink(merged, matchingEntry, link)
  })

  it('does not adds links to non matching entries', () => {
    const link = new Link('**link** *cf.* *matchinglemma*')
    const notMatchingEntry = new Entry('**notMatchinglemma** meaning')

    const merged = mergeLinks([notMatchingEntry], [link])

    expect(merged).toEqual([notMatchingEntry.toPlainObject()])
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
})
