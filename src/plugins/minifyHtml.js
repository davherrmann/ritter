const minifier = require('html-minifier')

module.exports = () => context => ({
  ...context,
  file: {
    ...context.file,
    content: minifier.minify(context.file.content, {collapseWhitespace: true})
  }
})
