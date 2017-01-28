const plugins = require('./plugins')

const createLink = dependencies => file => {
  dependencies.push(file)
  return file.path
}

const createFile = (configuration = {}) => (path, ...plugins) => {
  const file = {
    content: '',
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
