// p 54
const MyModules = (function manager() {
	const modules = {};

	function define(moduleName,	moduleDependencyNames = [], impl = f => f) {
		// 依赖的方法
		let deps = moduleDependencyNames.map(name => modules[name])

		// modules[moduleName] = impl.apply(impl, deps)
		modules[moduleName] = impl(...deps)
	};
	
	function get(moduleName) {
		return modules[moduleName] 
	}

	return {
		define,
		get
	}
})();

MyModules.define( "bar", [], function() {
	function hello(who) { 
		return "Let me introduce: " + who;    
	}
	return { hello: hello };
});
MyModules.define( "foo", ["bar"], function(bar) {
	var hungry = "hippo";
	function awesome() { 
		console.log( bar.hello( hungry ).toUpperCase() );    
	}
	return { awesome: awesome };
});

var bar = MyModules.get( "bar" );
var foo = MyModules.get( "foo" );
console.log(  bar.hello( "hippo" )); // Let me introduce: 
foo.awesome(); // LET ME INTRODUCE: HIP