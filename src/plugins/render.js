const stripIndent = require('strip-indent')
const trimNewlines = require('trim-newlines')

module.exports = template => context => {
  const rendered = typeof template === 'function'
    ? template(context)
    : template
  return {
    ...context,
    file: {
      ...context.file,
      content: trimNewlines(stripIndent(rendered))
    }
  }
}
