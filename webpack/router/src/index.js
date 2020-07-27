// https://juejin.im/post/5ac61da66fb9a028c71eae1b#heading-9

class HashRouter {
	constructor (route) {
		this.routers = {};
		this.history = [];
		this.currentIndex = -1;
		this.isBack = false;
		this.currentUrl = '';
		this.mode = 'hash'
		this.refresh = this.refresh.bind(this);

		this.init(route);
	}

	init(route) {
		this.setRouterMap(route);
		this.eventListener();
	}

	eventListener() {
		window.addEventListener('load', this.refresh, false);
		window.addEventListener('hashchange', this.refresh, false);
	}
	
	setRouterMap (route, parentFn) {
		for (let key in route) {
			this.route(key, route[key])
		}
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
		if (!this.isBack && this.routers[currentUrl]) {
			this.history.push(currentUrl);
			this.currentIndex++;
			this.routers[currentUrl]();
		};
		this.isBack = false
	}

	push(path) {

	}

	replace() {

	}

	back() {
		this.isBack = true
		let index = this.currentIndex <= 0
		? (this.currentIndex = 0)
		: (this.currentIndex = this.currentIndex - 1);

		let currentUrl = this.history[index];
		location.hash = "#"+ currentUrl;
		this.routers[currentUrl]()
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
	},
]


window.Router = new HashRouter(route);

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
