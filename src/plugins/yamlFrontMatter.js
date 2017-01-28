const matter = require('gray-matter')

module.exports = () => ({file}) => {
  const {data, content} = matter(file.content())

  file.content(() => content)
  file.meta(meta => ({
    ...meta,
    ...data
  }))
}
