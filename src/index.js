const fs = require('fs')
const p = require('path')
const plugins = require('./plugins')

const createLink = dependencies => file => {
  dependencies.push(file)
  return file.path
}

const createFile = (configuration = {}) => (path, ...plugins) => {
  const sourcePath = configuration.source
    ? p.join(configuration.source, path)
    : path

  const file = {
    content: fs.existsSync(sourcePath)
      ? fs.readFileSync(sourcePath, {encoding: 'utf-8'})
      : '',
    meta: {},
    path
  }

  return plugins.reduce((context, plugin) => plugin(context), {
    configuration,
    file
  }).file
}

module.exports = {
  createFile,
  createLink,
  plugins
}
