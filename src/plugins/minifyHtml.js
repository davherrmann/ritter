const minifier = require('html-minifier')

module.exports = () => context => Object.assign({}, context, {
  file: Object.assign({}, context.file, {
    content: minifier.minify(context.file.content, { collapseWhitespace: true })
  })
})
