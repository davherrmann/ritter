/* eslint-env jest */
const {createFile, createLink} = require('../src')
const {plugins: {render, read, raw, minifyCss, minifyHtml, markdown, yamlFrontMatter}} = require('../src')

describe('integration tests', () => {
  it('resolves dependencies correctly', () => {
    const dependencies = []
    const link = createLink(dependencies)
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
        <link rel="stylesheet" href="${link(cssFile)}">
      </head>
      <body lang=${context.configuration.language}>
        ${mdFile.content}
      </body>
    `), minifyHtml())

    expect(homeFile.content).toBe('<!DOCTYPE html><head><title>Hello World!</title><link rel="stylesheet" href="css/theme.css"></head><body lang="en"><h1>Testing markdown for blogging</h1><p>Just a few tests:</p><ul><li>Test A</li><li>Test B</li></ul></body>')
    expect(dependencies.length).toBe(1)
    expect(dependencies[0].path).toBe('css/theme.css')
  })
})

describe('link', () => {
  it('keeps file as dependency when link(...) is called', () => {
    const dependencies = []
    const link = createLink(dependencies)
    const file = createFile()
    const homeFile = file('index.html', render(`content`))

    const path = link(homeFile)

    expect(dependencies.length).toBe(1)
    expect(path).toBe('index.html')
  })
})

describe('file', () => {
  it('has empty content for non-existing path', () => {
    const file = createFile()
    const homeFile = file('index.html')

    expect(homeFile.content).toBe('')
  })

  it('has empty meta data', () => {
    const file = createFile()
    const homeFile = file('index.html')

    expect(homeFile.meta).toEqual({})
  })

  it('returns correct path', () => {
    const file = createFile()
    const homeFile = file('index.html')

    expect(homeFile.path).toBe('index.html')
  })

  it('uses file when file is provided', () => {
    const file = createFile()
    const templateFile = file('index.html')

    const testFile = file(templateFile)

    expect(testFile).toBe(templateFile)
  })
})

describe('read plugin', () => {
  it('has content of existing file', () => {
    const file = createFile()
    const testFile = file('test/files/test.html', read())

    expect(testFile.content).toBe('<h1>Hello World!</h1>\n')
  })

  it('has content of existing file relative to configured source folder', () => {
    const file = createFile({source: './test'})
    const homeFile = file('files/test.html', read())

    expect(homeFile.path).toBe('files/test.html')
    expect(homeFile.content).toBe('<h1>Hello World!</h1>\n')
  })
})

describe('raw plugin', () => {
  it('reads raw file as buffer', () => {
    const file = createFile({source: './test'})
    const homeFile = file('files/test.html', raw())

    expect(homeFile.content).toBeInstanceOf(Buffer)
  })
})

describe('render plugin', () => {
  it('renders static template into content', () => {
    const file = createFile()
    const homeFile = file('index.html', render(`<h1>Hello World!</h1>`))

    expect(homeFile.content).toBe('<h1>Hello World!</h1>')
  })

  it('renders dynamic template into content', () => {
    const file = createFile({title: 'Hello World!'})
    const homeTemplate = context => `${context.configuration.title}`

    const homeFile = file('index.html', render(homeTemplate))

    expect(homeFile.content).toBe('Hello World!')
  })
})

describe('markdown plugin', () => {
  it('converts markdown content into html content', () => {
    const file = createFile()
    const mdTemplate = `# Hello World!`
    const mdFile = file('index.md', render(mdTemplate), markdown())

    expect(mdFile.content).toBe('<h1>Hello World!</h1>')
  })

  it('changes path from .md to .html', () => {
    const file = createFile()
    const mdFile = file('test/entry.md', markdown())

    expect(mdFile.path).toBe('test/entry.html')
  })

  it('renders backticked indented template not as code block', () => {
    const file = createFile()
    const mdFile = file('test.md', render(`
      # Hello World!

      Test a text and:
      - A
      - List
    `), markdown(), minifyHtml())

    expect(mdFile.content).toBe('<h1>Hello World!</h1><p>Test a text and:</p><ul><li>A</li><li>List</li></ul>')
  })
})

describe('minifyHtml plugin', () => {
  it('minifies html content', () => {
    const file = createFile()
    const htmlTemplate = `
      <h1 class  =  "title" >  Hello World!  </h1>
    `
    const htmlFile = file('index.html', render(htmlTemplate), minifyHtml())

    expect(htmlFile.content).toBe('<h1 class="title">Hello World!</h1>')
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

  expect(cssFile.content).toBe('.title{background-color:red}')
})

describe('yamlFrontMatter plugin', () => {
  const file = createFile()
  const mdTemplate = `
    ---
    date: "2017-01-10T15:34:32+01:00"
    title: "Writing about Hello World"
    draft: false
    ---

    # Hello World!
  `
  const mdFile = file('test.md', render(mdTemplate), yamlFrontMatter())

  expect(mdFile.content.trim()).toBe('# Hello World!'.trim())
  expect(mdFile.meta).toEqual({
    date: '2017-01-10T15:34:32+01:00',
    title: 'Writing about Hello World',
    draft: false
  })
})
