function f(a) {
	console.log("f", a+1)

	return a+1
}
function m1(next) {
	console.log("m1")
	return function(a) {
		console.log("m1-1")
		return next(a) + 1
	}
}
function m2(next) {
	console.log("m2")
	return function(a) {
		console.log("m2-2")
		return next(a) + 1
	}
}
function m3(next) {
	console.log("m3")
	return function(a) {
		console.log("m3-3")
		return next(a) + 1
	}
}


function applyMiddleware(...arg) {

}

// m1(f)(1)

m2(m1)(f)()


