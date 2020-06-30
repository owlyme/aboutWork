// p47
function closureFalse () {
	for (var i = 1; i <= 5; i++) {
		setTimeout(() =>{ 
			console.log(i)
		}, i * 1000)
	}
}

function closure1 () {
	for (var i = 1; i <= 5; i++) {
		((j) => {
			setTimeout(() =>{ 
				console.log(j)
			}, j * 1000)
		})(i)
	}
}

// for循环头部的let声明还会有一个特殊的行为。 这个行为指出变量在循环过程中不止被声明一次，每次迭代都会声明。 随后的每个迭代都会使用上一个迭代结束时的值来初始化这个变量
function closure2 () {
	for (let i = 1; i <= 5; i++) {
		setTimeout(() =>{ 
			console.log(j)
		}, i * 1000)
	}
}
