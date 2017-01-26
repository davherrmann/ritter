const fs = require('fs')
const p = require('path')
const plugins = require('./plugins')

const createFile = (configuration = {}, dependencies = []) => (path, ...plugins) => {
  const sourcePath = configuration.source
    ? p.join(configuration.source, path)
    : path
  const file = plugins.reduce((context, plugin) => plugin(context), {
    configuration,
    dependencies,
    file: {
      content: fs.existsSync(sourcePath)
        ? fs.readFileSync(sourcePath, {encoding: 'utf-8'})
        : '',
      meta: {},
      path
    }
  }).file

  return {
    content: () => file.content,
    dependencies: () => dependencies,
    meta: () => file.meta,
    path () {
      dependencies.push(file)
      return file.path
    }
  }
}

module.exports = {
  createFile,
  plugins
}
