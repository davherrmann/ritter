const marked = require('marked')
const prism = require('prismjs')

const renderer = new marked.Renderer()
renderer.heading = (text, level) => `<h${level}>${text}</h${level}>`

marked.setOptions({
  highlight: (code, lang) => prism.highlight(code, prism.languages[lang]),
  renderer,
  sanitize: false
})

module.exports = () => ({file}) => {
  file.content(marked(file.content()))
  file.path(path => path.replace(/md$/, 'html'))
}
