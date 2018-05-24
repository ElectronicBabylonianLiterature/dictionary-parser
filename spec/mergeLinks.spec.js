const Link = require('../lib/Link')
const Entry = require('../lib/Entry')

describe('mergeLinks', () => {
  const mergeLinks = require('../lib/mergeLinks')

  it('adds links as derived forms', () => {
    const link = new Link('**link** *cf.* *matchinglemma*')
    const matchingEntry = new Entry('**matchinglemma** meaning')

    const merged = mergeLinks([matchingEntry], [link])

    expect(merged).toEqual([{
      ...matchingEntry.toPlainObject(),
      derived: [{
        lemma: ['link'],
        homonym: 'I',
        notes: [],
        source: link.source
      }]
    }])
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

    expect(merged).toEqual([{
      ...matchingEntry.toPlainObject(),
      derived: [{
        lemma: ['link'],
        homonym: 'I',
        notes: [],
        source: link.source
      }]
    }])
  })
})
