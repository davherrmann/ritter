const matter = require('gray-matter')

module.exports = () => context => {
  const {data, content} = matter(context.file.content)

  return Object.assign({}, context, {
    ...context,
    file: {
      ...context.file,
      content,
      meta: {
        ...context.file.meta,
        ...data
      }
    }
  })
}
