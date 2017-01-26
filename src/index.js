const fs = require('fs')
const p = require('path')
const plugins = require('./plugins')

const createFile = (configuration = {}, dependencies = []) => (path, ...plugins) => {
  const file = plugins.reduce((context, plugin) => plugin(context), {
    configuration,
    dependencies,
    file: {
      path: configuration.source
        ? p.join(configuration.source, path)
        : path,
      content: fs.existsSync(path)
        ? fs.readFileSync(path, {encoding: 'utf-8'})
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
