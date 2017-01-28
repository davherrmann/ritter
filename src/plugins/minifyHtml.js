const minifier = require('html-minifier')

module.exports = () => ({file}) => {
  file.content(content => minifier.minify(content, {collapseWhitespace: true}))
}
