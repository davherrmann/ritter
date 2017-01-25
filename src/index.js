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

module.exports = {
  createFile
}
