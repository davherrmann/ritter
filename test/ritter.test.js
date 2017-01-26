/* eslint-env jest */
const {createFile} = require('../src')
const {plugins: {render, minifyCss, minifyHtml, markdown}} = require('../src')

describe('integration tests', () => {
  it('resolves dependencies correctly', () => {
    const file = createFile({
      title: 'Hello World!',
      author: 'John Doe',
      language: 'en',
      colors: {
        primary: 'skyblue',
        secondary: '#ffaa00'
      }
    })

    const cssFile = file('css/theme.css', render(context => `
      body {
        background-color: ${context.configuration.colors.primary};
      }
      h1, h2, h3 {
        color: ${context.configuration.colors.secondary}
      }
    `), minifyCss())

    const mdFile = file('blog/blogpost.md', render(`
      # Testing markdown for blogging

      Just a few tests:
      - Test A
      - Test B
    `), markdown(), minifyHtml())

    const homeFile = file('index.html', render(context => `
      <!DOCTYPE html>
      <head>
        <title>${context.configuration.title}</title>
        <link rel="stylesheet" href="${cssFile.path()}">
      </head>
      <body lang=${context.configuration.language}>
        ${mdFile.content()}
      </body>
    `), minifyHtml())

    expect(homeFile.content()).toBe('<!DOCTYPE html><head><title>Hello World!</title><link rel="stylesheet" href="css/theme.css"></head><body lang="en"><h1>Testing markdown for blogging</h1><p>Just a few tests:</p><ul><li>Test A</li><li>Test B</li></ul></body>')
    expect(homeFile.dependencies()).toEqual([{
      path: 'css/theme.css',
      content: 'body{background-color:#87ceeb}h1,h2,h3{color:#fa0}'
    }])
  })
})

describe('file', () => {
  it('has empty content for non-existing path', () => {
    const file = createFile()
    const homeFile = file('index.html')

    expect(homeFile.content()).toBe('')
  })

  it('has content of existing file', () => {
    const file = createFile()
    const testFile = file('test/test.html')

    expect(testFile.content()).toBe('<h1>Hello World!</h1>\n')
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

  it('renders backticked indented template not as code block', () => {
    const file = createFile()
    const mdFile = file('test.md', render(`
      # Hello World!

      Test a text and:
      - A
      - List
    `), markdown(), minifyHtml())

    expect(mdFile.content()).toBe('<h1>Hello World!</h1><p>Test a text and:</p><ul><li>A</li><li>List</li></ul>')
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
