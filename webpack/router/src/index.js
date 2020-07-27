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
	
	setRouterMap (route) {
		for (let key in route) {
			this.route(key, route[key])
		}
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

const route = {
	"/": () => { console.log("/"); pageA() },
	"/news": () => {console.log("/news"); pageB() }
}

window.Router = new HashRouter(route);

function pageA(){
	var div = document.querySelector('#content');
	div.innerHTML = '<h2>这是首页</h2>';
};
function pageB(){
	var div = document.querySelector('#content');
	div.innerHTML = '<h2>这是新闻页</h2>';
};
