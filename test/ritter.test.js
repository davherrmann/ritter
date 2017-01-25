/* eslint-env jest */
const {createFile} = require('../src')
const {render, template, minifyCss, minifyHtml, markdown} = require('../src/plugins')

const configuration = {
  title: 'Hello World!'
}

describe('file', () => {
  it('has empty content', () => {
    const file = createFile(configuration)
    const homeFile = file('index.html')

    expect(homeFile.content()).toBe('')
  })

  it('returns correct path', () => {
    const file = createFile(configuration)
    const homeFile = file('index.html')

    expect(homeFile.path()).toBe('index.html')
  })

  it('marks file as dependency when path() is used', () => {
    const file = createFile(configuration)
    const homeFile = file('home.html')
    homeFile.path()

    expect(homeFile.dependencies().length).toBe(1)
    expect(homeFile.dependencies()[0]).toEqual({
      content: '',
      path: 'home.html'
    })
  })
})
describe('render plugin', () => {
  it('renders static template into content', () => {
    const file = createFile(configuration)
    const homeFile = file('index.html', render(`<h1>Hello World!</h1>`))

    expect(homeFile.content()).toBe('<h1>Hello World!</h1>')
  })

  it('renders dynamic template into content', () => {
    const file = createFile({title: 'Hello World!'})
    const homeTemplate = context => `${context.configuration.title}`

    const homeFile = file('index.html', render(homeTemplate))

    expect(homeFile.content()).toBe('Hello World!')
  })
})
