const CleanCSS = require('clean-css')

module.exports = () => context => ({
  ...context,
  file: {
    ...context.file,
    content: new CleanCSS({}).minify(context.file.content).styles
  }
})
