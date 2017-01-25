/* eslint-env jest */

const {minifyHtml} = require('../../src/plugins')

describe('minifyHtml plugin', () => {
  it('minifies the html of a file in context', () => {
    const context = {
      file: {
        content: `
          <div    id= "test">
            <h1 >  Title </h1>
          </div>
        `
      }
    }
    expect(minifyHtml()(context).file.content)
      .toBe('<div id="test"><h1>Title</h1></div>')
  })
})
