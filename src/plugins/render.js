const stripIndent = require('strip-indent')

module.exports = template => context => ({
  ...context,
  file: {
    ...context.file,
    content: stripIndent(typeof template === 'function'
      ? template(context)
      : template)
  }
})
