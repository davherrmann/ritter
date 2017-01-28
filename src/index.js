const fs = require('fs')
const p = require('path')
const plugins = require('./plugins')

const createFile = (configuration = {}, dependencies = []) => (path, ...plugins) => {
  const sourcePath = configuration.source
    ? p.join(configuration.source, path)
    : path

  const rawFile = {
    content: fs.existsSync(sourcePath)
      ? fs.readFileSync(sourcePath, {encoding: 'utf-8'})
      : '',
    meta: {},
    path
  }

  const file = {
    content (changeFn = value => value) {
      rawFile.content = changeFn(rawFile.content)
      return rawFile.content
    },
    dependencies: () => dependencies,
    meta (changeFn = value => value) {
      rawFile.meta = changeFn(rawFile.meta)
      return rawFile.meta
    },
    path (changeFn) {
      if (changeFn) {
        rawFile.path = changeFn(rawFile.path)
      } else {
        dependencies.push(rawFile)
      }
      return rawFile.path
    },
    raw: () => rawFile
  }

  const context = {
    configuration,
    dependencies,
    file
  }

  plugins.forEach(plugin => plugin(context))

  return file
}

module.exports = {
  createFile,
  plugins
}
