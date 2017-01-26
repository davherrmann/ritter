const stripIndent = require('strip-indent')
const trimNewlines = require('trim-newlines')

module.exports = template => context => ({
  ...context,
  file: {
    ...context.file,
    content: trimNewlines(stripIndent(typeof template === 'function'
      ? template(context)
      : template))
  }
})
