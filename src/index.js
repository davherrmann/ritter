const plugins = require('./plugins')

const createLink = dependencies => file => {
  dependencies.push(file)
  return file.path
}

const createFile = (configuration = {}) => (given, ...plugins) => {
  const fileIsGiven = typeof given !== 'string'

  const file = fileIsGiven
    ? given
    : { content: '', meta: {}, path: given }

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
