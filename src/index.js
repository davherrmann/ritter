const file = (path, ...plugins) => ({
  targetPath: path,
  path () {
    return {
      ...this,
      persist: true
    }
  },
  useContent () {
    return this
  },
  render (context) {
    return this.plugins.reduce((context, plugin) => plugin(context), {...context, file: this})
  },
  content: '',
  plugins
})

const createFile = (configuration = {}, dependencies = []) => (path, ...plugins) => {
  const file = plugins.reduce((context, plugin) => plugin(context), {
    configuration,
    dependencies,
    file: {
      path,
      content: ''
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

const element = (type, props, children) => ({
  type,
  props,
  children
})

const build = (context, file) => {
  const resultFile = file.plugins.reduce((context, plugin) => plugin(context), {file, ...context})

  return resultFile
}

module.exports = {
  build,
  createFile,
  element,
  file
}
