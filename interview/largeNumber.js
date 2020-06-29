let num1 = "3451212316"
let num2 = "4789"

function convertStringToNumber(str) {
	return Number(str || "0")
}
function convertStringToArray(str) {
	return (str || "").split("") || []
}

function convertLargeNumStrToNumberArr(str) {
	return convertStringToArray(str).map(i => convertStringToNumber(i))
}

function largeAdd(numArr1, numArr2) {
	let arr1 = numArr1 || []  // [4,3,2,1]
	let arr2 = numArr2 || []  // [7,8,9]

	let sumArr = []
	let index = 0
	while (arr1[index] !== undefined || arr2[index] !== undefined) {
		let n1 = arr1[index] || 0
		let n2 = arr2[index] || 0
		let n3 = sumArr[index] || 0

		let sum = n1 + n2 + n3

		if (sum > 9) {
			sumArr[index] = sum - 10
			sumArr[index + 1] = 1
		} else {
			sumArr[index] = sum
		}

		index++;
	}

	return sumArr.reverse().join("")
}

console.log(largeAdd(convertLargeNumStrToNumberArr(num1).reverse(), convertLargeNumStrToNumberArr(num2).reverse()))