const expand = require('../lib/expand.js')

describe('expandParentheses', () => {
  let replace
  let result

  beforeEach(() => {
    replace = jasmine.createSpy('replace').and.returnValue('y')
    result = expand('xbx', /x/g, replace)
  })

  it('calls replace for all combinations', () => {
    expect(replace).toHaveBeenCalledTimes(8)
  })

  it('replaces matches in string', () => {
    expect(result).toEqual(jasmine.arrayWithExactContents(['yby', 'yby', 'yby', 'yby']))
  })
})
