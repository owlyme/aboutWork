const {getOptions} = require('loader-utils');


module.exports = function(source) {
	  const options = getOptions(this);
	//   console.log(options)
	//   console.log(source)
	
	  // 对资源应用一些转换……

	  return  `// timer: ${options.time} \n` + source
	};