const CleanCSS = require('clean-css')

module.exports = () => ({file}) => {
  file.content(new CleanCSS({}).minify(file.content()).styles)
}
