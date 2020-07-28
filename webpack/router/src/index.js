// https://juejin.im/post/5ac61da66fb9a028c71eae1b#heading-9

class HashRouter {
	constructor (route) {
		this.routers = {};
		this.history = [];
		this.currentIndex = this.history.length -1 ;
		this.currentUrl = '';

		this.isBack = false;
		this.isReplace = false;
		this.isForward = false;

		this.beforeEachHooks = []
		this.afterEachHooks = []

		this.mode = 'hash'
		this.refresh = this.refresh.bind(this);

		this.init(route);
	}

	init(route) {
		this.setRouterMap(route);
		this.eventListener();
	}

	eventListener() {
		window.addEventListener('load', ()=> this.refresh("loaded"), false);
		window.addEventListener('hashchange', ()=> this.refresh("hashChanged"), false);
	}

	setRouterMap (route, parentFn) {
		route.forEach((item) => {
			let key = item.path;
			let fn = () => {
				if (parentFn) parentFn();
				item.component()
			}

			this.route(key, fn);

			if (item.children && Array.isArray(item.children)) {
				this.setRouterMap(item.children, item.component)
			}
		})
	}

	route(path, callback) {
		this.routers[path] = callback || function() {};
	}

	refresh() {
		let currentUrl = this.currentUrl = location.hash.slice(1) || "/";

		let nextStepRedy = false;
		let from = this.history[this.currentIndex] || null
		let to = currentUrl
		let next = () => nextStepRedy = true;

		this.runBeforeEachHooks(from, to, next)
		if (!this.beforeEachHooks.length) {
			next()
		}
		if (nextStepRedy) {
			if (!this.isBack && !this.isReplace && !this.isForward) {
				this.history.push(currentUrl);
				this.currentIndex++;
			}

			if (this.routers[currentUrl]) {
				this.routers[currentUrl]();
			};

			this.runAfterEachHooks(from, to, next);
		}

		this.isBack = false;
		this.isBack = false;
		this.isForward = false;
	}

	push(path) {
		let _path = /#/.test(path) ? path : `#${path}`
		this.history.splice(1, this.history.length)
		this.currentIndex = this.history.length;
		location.hash = _path
	}

	replace(path) {
		this.isReplace = true;
		let _path = /#/.test(path) ? path : `#${path}`
		this.history[this.currentIndex] = _path
		location.hash = _path
	}

	back() {
		this.isBack = true;
		this.currentIndex <= 0
		? (this.currentIndex = 0)
		: (this.currentIndex = this.currentIndex - 1);

		let currentUrl = this.history[this.currentIndex];
		location.hash = "#"+ currentUrl;
	}

	forward() {
		this.isForward = true;
		this.currentIndex >= this.history.length
		? (this.currentIndex = this.history.length-1)
		: (this.currentIndex = this.currentIndex + 1);

		let currentUrl = this.history[this.currentIndex];
		location.hash = "#"+ currentUrl;
	}
	go(index) {
		let currentIndex = this.currentIndex = this.currentIndex + index;

		if(currentIndex < 0) {
			currentIndex = 0
		} else if (currentIndex >= this.history.length) {
			currentIndex = this.history.length - 1
		}

		this.currentIndex = currentIndex;
		let currentUrl = this.history[this.currentIndex];
		location.hash = "#"+ currentUrl;
	}

	beforeEach(fn) {
		this.beforeEachHooks.push(fn)
	}
	runBeforeEachHooks(from, to, next) {
		this.beforeEachHooks.forEach((callback) => {
			callback(from, to, next)
		})
	}
	afterEach(fn) {
		this.afterEachHooks.push(fn)
	}
	runAfterEachHooks(from, to, next) {
		this.afterEachHooks.forEach((callback) => {
			callback(from, to, next)
		})
	}
}

class HistoryRouter {
	constructor (route) {
		this.routers = {};
		this.history = [];
		this.currentIndex = this.history.length -1 ;
		this.currentUrl = '';

		this.isBack = false;
		this.isReplace = false;
		this.isForward = false;

		this.beforeEachHooks = []
		this.afterEachHooks = []

		this.mode = 'hash'
		this.refresh = this.refresh.bind(this);

		this.init(route);
	}
	init(route) {
		this.setRouterMap(route);
		this.eventListener();
	}

	eventListener() {
		window.addEventListener('load', ()=> this.refresh("loaded"), false);
		// 需要注意的是调用history.pushState()或history.replaceState()不会触发popstate事件。
		// 只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮（或者在Javascript代码中调用history.back()或者history.forward()方法）
		window.addEventListener('popstate', ()=> this.refresh("popstate"), false);
	}

	setRouterMap (route, parentFn) {
		route.forEach((item) => {
			let key = item.path;
			let fn = () => {
				if (parentFn) parentFn();
				item.component()
			}

			this.route(key, fn);

			if (item.children && Array.isArray(item.children)) {
				this.setRouterMap(item.children, item.component)
			}
		})
	}

	route(path, callback) {
		this.routers[path] = callback || function() {};
	}

	refresh(status) {
		console.log("status", status);
		let currentUrl = this.currentUrl = location.pathname

		let nextStepRedy = false;
		let from = this.history[this.currentIndex] || null
		let to = currentUrl
		let next = () => nextStepRedy = true;

		this.runBeforeEachHooks(from, to, next)
		if (!this.beforeEachHooks.length) {
			next()
		}
		if (nextStepRedy) {
			if (!this.isBack && !this.isReplace && !this.isForward) {
				this.history.push(currentUrl);
				this.currentIndex++;
			}

			if (this.routers[currentUrl]) {
				this.routers[currentUrl]();
			};

			this.runAfterEachHooks(from, to, next);
		}

		this.isBack = false;
		this.isBack = false;
		this.isForward = false;
	}

	push(path) {
		this.history.splice(1, this.history.length)
		this.currentIndex = this.history.length;
		let state = {
			index: this.currentIndex
		}
		
		window.history.pushState(state, '', path)
		this.refresh("pushState")
	}

	replace(path) {
		this.isReplace = true;

		this.history[this.currentIndex] = path
		let state = {
			index: this.currentIndex
		}
		window.history.replaceState(state, '', path)
		this.refresh("preplaceState")
	}

	back() {
		this.isBack = true;
		this.currentIndex <= 0
		? (this.currentIndex = 0)
		: (this.currentIndex = this.currentIndex - 1);

		window.history.back()
	}

	forward() {
		this.isForward = true;
		this.currentIndex >= this.history.length
		? (this.currentIndex = this.history.length-1)
		: (this.currentIndex = this.currentIndex + 1);

		window.history.forward()
	}
	go(index) {
		window.history.go(index)
	}

	beforeEach(fn) {
		this.beforeEachHooks.push(fn)
	}
	runBeforeEachHooks(from, to, next) {
		this.beforeEachHooks.forEach((callback) => {
			callback(from, to, next)
		})
	}
	afterEach(fn) {
		this.afterEachHooks.push(fn)
	}
	runAfterEachHooks(from, to, next) {
		this.afterEachHooks.forEach((callback) => {
			callback(from, to, next)
		})
	}

}


const route = [
	{
		path: "/",
		component: () => { console.log("/"); pageA() },
	},
	{
		path: "/news",
		component: () => {console.log("/news"); pageB() },
		children: [
			{
				path: "/news/child",
				component: () => { console.log("/news/child"); pageBC() },
			},
		]
	}
]


window.Router = new HistoryRouter(route);

function pageA(){
	var div = document.querySelector('#content');
	div.innerHTML = '<h2>这是首页</h2>';
};
function pageB(){
	var div = document.querySelector('#content');
	div.innerHTML = '<h2>这是新闻页</h2><div id="content-1"></div>';
};
function pageBC(){
	var div = document.querySelector('#content-1');
	div.innerHTML = '<h3>这是新闻的详情页</h3>';
};

Router.beforeEach((from, to, next) => {
	console.log(from, to);
	next()
})