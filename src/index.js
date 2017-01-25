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
  element,
  file
}
