function MyPlugin() {}

MyPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {

    // 检索每个（构建输出的）chunk：
    compilation.chunks.forEach(function(chunk) {
      // 检索 chunk 中（内置输入的）的每个模块：
      chunk.modules.forEach(function(module) {
        // 检索模块中包含的每个源文件路径：
        module.fileDependencies.forEach(function(filepath) {
          // 我们现在已经对源结构有不少了解……
          console.log(filepath)
        });
      });

      // 检索由 chunk 生成的每个资源(asset)文件名：
      chunk.files.forEach(function(filename) {
        // Get the asset source for each file generated by the chunk:
        var source = compilation.assets[filename].source();
      });
    });

    callback();
  });
};

module.exports = MyPlugin;