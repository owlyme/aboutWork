const path = require('path');
const fs = require('fs');

module.exports = function(source) {
  var callback = this.async();
  var headerPath = path.resolve('src/head.js');

  this.addDependency(headerPath);

  fs.readFile(headerPath, 'utf-8', function(err, header) {
	if(err) return callback(err);
	// console.log(header)
    callback(null, header + "\n" + source);
  });
};