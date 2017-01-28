const minifier = require('html-minifier')

module.exports = () => ({file}) => {
  file.content(minifier.minify(file.content(), {collapseWhitespace: true}))
}
