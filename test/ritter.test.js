/* eslint-env jest */
const {createFile} = require('../src')
const {render, minifyCss, minifyHtml, markdown} = require('../src/plugins')

describe('file', () => {
  it('has empty content', () => {
    const file = createFile()
    const homeFile = file('index.html')

    expect(homeFile.content()).toBe('')
  })

  it('returns correct path', () => {
    const file = createFile()
    const homeFile = file('index.html')

    expect(homeFile.path()).toBe('index.html')
  })

  it('marks file as dependency when path() is used', () => {
    const file = createFile()
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
    const file = createFile()
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

describe('markdown plugin', () => {
  it('converts markdown content into html content', () => {
    const file = createFile()
    const mdTemplate = `# Hello World!`
    const mdFile = file('index.md', render(mdTemplate), markdown())

    expect(mdFile.content()).toBe('<h1>Hello World!</h1>')
  })

  it('changes path from .md to .html', () => {
    const file = createFile()
    const mdFile = file('test/entry.md', markdown())

    expect(mdFile.path()).toBe('test/entry.html')
  })
})

describe('minifyHtml plugin', () => {
  it('minifies html content', () => {
    const file = createFile()
    const htmlTemplate = `
      <h1 class  =  "title" >  Hello World!  </h1>
    `
    const htmlFile = file('index.html', render(htmlTemplate), minifyHtml())

    expect(htmlFile.content()).toBe('<h1 class="title">Hello World!</h1>')
  })
})

describe('minifyCss plugin', () => {
  const file = createFile()
  const cssTemplate = `
    .title {
        background-color:   red ;

    }
  `
  const cssFile = file('theme.css', render(cssTemplate), minifyCss())
  expect(cssFile.content()).toBe('.title{background-color:red}')
})
