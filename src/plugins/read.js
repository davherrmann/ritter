const fs = require('fs')
const p = require('path')

module.exports = (options = {encoding: 'utf-8'}) => context => {
  const sourcePath = context.configuration.source
    ? p.join(context.configuration.source, context.file.path)
    : context.file.path

  return {
    ...context,
    file: {
      ...context.file,
      content: fs.existsSync(sourcePath)
        ? fs.readFileSync(sourcePath, options)
        : ''
    }
  }
}
