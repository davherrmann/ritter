const extract = (context, value) => {
  if (value.render) {
    value = value.render(context).file
  }
  if (value && value.persist) {
    context.persist = context.persist || []
    context.persist.push(value)
    return value.targetPath
  }

  return value.content
}

module.exports = template => context => {
  const templated = template(context)

  const rendered = templated
    .strings[0]
    .concat(templated.values.map((v, i) =>
      extract(context, v) + templated.strings[i + 1]).join(''))

  return {
    ...context,
    file: {
      ...context.file,
      content: rendered
    }
  }
}
