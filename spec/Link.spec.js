describe('Link', () => {
  const Link = require('../lib/Link')

  describe('isLink', () => {
    [
      '**\\*source** *cf.* *target*',
      '**\\*source** *cf.* *target* note',
      '**\\*source** *cf.* *target',
      '**source** *cf.* *target* extra',
      '**source** etc. *cf.* *target*',
      '**source**, **source2** *cf.* *target*',
      '**source1 source2** *cf.* *target* 5'
    ].forEach(row => {
      it(`${row} is a link`, () => {
        expect(Link.isLink(row)).toEqual(true)
      })
    });

    [
      '**lemma** meaning; *cf.* *derived*',
      '**lemma** \\[LOG\\]; *cf.* *derived*'
    ].forEach(row => {
      it(`${row} is not a link`, () => {
        expect(Link.isLink(row)).toEqual(false)
      })
    })

    describe('lemma', () => {

    })
  })

  it('has source', () => {
    expect(new Link('source').source).toEqual('source')
  })
})
