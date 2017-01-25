/* eslint-env jest */
const {file} = require('../src')
const {render, template, minifyCss, minifyHtml, markdown} = require('../src/plugins')

describe('ritter', () => {
  it('should have a file function', () => {
    expect(file).toBeDefined()
  })
})

describe('file', () => {
  it('marks file as persistent when path() is used', () => {
    const testFile = file('test.html').path()
    const fileTemplate = context => template`
      ${testFile}
    `

    expect(render(fileTemplate)({}).persist[0]).toBe(testFile)
  })

  it('renders the content when content() is used', () => {
    const innerTemplate = context => template`Hello World!`
    const fileTemplate = context => template`
      ${file('test.html', render(innerTemplate)).useContent()}
    `

    const rootFile = file('index.html', render(fileTemplate), minifyHtml())

    expect(rootFile.render({}).file.content).toBe('Hello World!')
  })

  it('processes markdown correctly', () => {
    const mdTemplate = context => template`# Hello World!`
    const mdFile = file('test.md', render(mdTemplate), markdown())

    expect(mdFile.render({}).file.content).toBe('<h1>Hello World!</h1>')
  })

  it('renders an html file path when md file was processed', () => {
    const mdFile = file('test.md', markdown())
    const fileTemplate = context => template`${mdFile.path()}`
    const renderedFile = file('index.html', render(fileTemplate)).render({})

    expect(renderedFile.file.content).toBe('test.html')
  })

  it('renders and minifies html correctly', () => {
    const homeTemplate = context => template`
      <!DOCTYPE html>
      <head>
        <link rel="stylesheet" href="${file('css/theme.css', minifyCss()).path()}"/>
      </head>
      <body>

      </body>
    `

    const home = file('index.html', render(homeTemplate), minifyHtml())

    expect(home.render({}).file.content).toBe('<!DOCTYPE html><head><link rel="stylesheet" href="css/theme.css"></head><body></body>')
  })

  it('renders nested templates', () => {
    const homeTemplate = context => template`
      <h1>Posts</h1>
      <ul>
      ${[0, 1, 2].map(index => file(index + '.html', render(context => template`
          <li class="${index}">${context.file.targetPath}</li>
        `)).useContent())}
      </ul>
    `

    const renderedHome = file('index.html', render(homeTemplate), minifyHtml()).render({}).file.content

    // expect(renderedHome).toBe('')
  })

  it('modified context instead of immutable lazy creation', () => {
    const fileFactory = (context = {persist: []}) => (path, ...plugins) => ({
      path () {
        context.persist.push(this)
      }
    })

    const context = {
      persist: []
    }

    const file = fileFactory(context)
    const testFile = file()

    testFile.path()

    expect(context.persist.length).toBe(1)
  })
})
