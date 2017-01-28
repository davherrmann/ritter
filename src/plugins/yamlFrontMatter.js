const matter = require('gray-matter')

module.exports = () => context => {
  const {data, content} = matter(context.file.content)

  return {
    ...context,
    file: {
      ...context.file,
      content,
      meta: {
        ...context.file.meta,
        ...data
      }
    }
  }
}
