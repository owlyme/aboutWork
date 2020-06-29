var obj = {
	id: "awesome",
 	cool: function coolFn() {
		console.log( this.id );
	},
	cool1: () => {
		console.log( this.id );
	}
};
var id = "not awesome";

obj.cool();
setTimeout(obj.cool, 100 )
setTimeout(() => {
	obj.cool()
}, 200)

obj.cool1();
setTimeout( obj.cool1, 1000 )
setTimeout(() => {
	obj.cool1()
}, 2000)