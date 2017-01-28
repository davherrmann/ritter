const matter = require('gray-matter')

module.exports = () => ({file}) => {
  const {data, content} = matter(file.content())

  file.content(content)
  file.meta({
    ...file.meta,
    ...data
  })
}
