const CleanCSS = require('clean-css')

module.exports = () => ({file}) => {
  file.content(content => new CleanCSS({}).minify(content).styles)
}
