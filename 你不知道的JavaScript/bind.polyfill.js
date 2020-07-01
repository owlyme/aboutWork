
Function.prototype.bind1 = function(newThis) {

	if (typeof this !== 'function') {
		throw new TypeError("得是一个函数")
	}

	let args = Array.prototype.slice.call(arguments, 1);
	let fToBind = this;
	let fNop = function() {};

	let fBound = function() {

		let self = this instanceof fNop && newThis ? this : newThis;

		return fToBind.apply(
			self, 
			args.concat(Array.prototype.slice.call(arguments))
			)
	}

	fNop.prototype = this.prototype
	fBound.prototype = new fNop()
	
	return fBound
}

function Fn(a, b) {
	this.a = 1234
	console.log(a, b)
}

var a = {a: 1}
Fn.bind1(a)(1,2)

