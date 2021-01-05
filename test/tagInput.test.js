
describe('TagInput', () => {
  beforeAll(() => {
    document.body.innerHTML = '<input class="desc1-input" type="text">'
  
    const input = document.querySelector('.desc1-input')
    
    global.TagInput = new window.TagInput(input)
  })

  it('should search keyword exactly from data', () => {
    expect(TagInput.search(['t1', 'at2b'], 't')).toMatchObject([
      {
        index: 0,
        match: { value: 't', index: 0, input: 't1' },
        value: 't1'
      },
      {
        index: 1,
        match: { value: 't', index: 1, input: 'at2b' },
        value: 'at2b'
      }
    ])
  })

  it('should search keyword exactly when result is none', () => {
    expect(TagInput.search(['t1', 'at2b'], 'c')).toMatchObject([])
  })
})