module.exports = template => context => ({
  ...context,
  file: {
    ...context.file,
    content: typeof template === 'function' ? template(context) : template
  }
})
