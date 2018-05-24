const Link = require('../lib/Link')
const Entry = require('../lib/Entry')

describe('mergeLinks', () => {
  const mergeLinks = require('../lib/mergeLinks')

  it('adds links as derived forms', () => {
    const link = new Link('**link** *cf.* *matchinglemma*')
    const matchingEntry = new Entry('**matchinglemma** meaning')
    const notMatchingEntry = new Entry('**matchinglemma** meaning')

    const merged = mergeLinks([matchingEntry, notMatchingEntry], [link])

    expect(merged[0]).toEqual({
      ...matchingEntry.toPlainObject(),
      derived: [{
        lemma: ['link'],
        homonym: 'I',
        notes: [],
        source: link.source
      }]
    })
  })
})
