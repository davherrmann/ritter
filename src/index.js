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
      path,
      content: fs.existsSync(sourcePath)
        ? fs.readFileSync(sourcePath, {encoding: 'utf-8'})
        : ''
    }
  }).file

  return {
    content: () => file.content,
    dependencies: () => dependencies,
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
