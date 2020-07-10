### 解决浏览器会呈现卡死的状态3个方向
1. 优化每个任务，让它有多快就多快。挤压CPU运算量
	+ Vue 选择
	+ 因为对于Vue来说，使用模板让它有了很多优化的空间，配合响应式机制可以让Vue可以精确地进行节点更新（https://www.yuque.com/vueconf/2019/gwn1z0）
2. 快速响应用户，让用户觉得够快，不能阻塞用户的交互
	+ React 选择
3. 尝试 Worker 多线程

### RequestIdleCallback
1. React 16 新的调度策略（Fiber）,新的调度策略提到的异步、可中断，其实就是基于浏览器的 requestIdleCallback和requestAnimationFrame两个API。虽然React是自己实现了一套类似的requestIdleCallback机制，不过大同小异，还是有必要了解一下这两个API。
2. life of a Frame （16ms 1000 / 60）
	+ (处理用户输入事件)Input events
	+ js执行 
	+ requestAnimation调用 rAF
	+ 布局 layOut
	+ 绘制 Paint
3. 在每一帧（16ms）内完成以上的所有任务，剩余的时间会执行RequestIdleCallback的回调
### [fiber](https://juejin.im/post/5dadc6045188255a270a0f85#heading-1)
1. Fiber 协程； 它是一种控制流程的让出机制
2. React Fiber: React渲染的进程可以被中断，可以将控制权交回浏览器，让位给高优先级的任务，浏览器空闲时在回复渲染。
	+ 浏览器没有抢占机制，所以React只能让出；
	+ 怎么确认有高优先任务要处理，即什么时候让出?
	+ React为什么不使用Generator？
3. React Fiber改造： 
	+ 数据机构的调整: 使用链表
	+ 拆分成两个部分： 
		0. https://github.com/facebook/react/issues/13186#issuecomment-403959161
		1. Reconciliation（协调阶段），
			+ diff在这个阶段， 找出所有的节点变更，例如节点的新增，删除，属性变更，这些变更称之为‘副作用（effects）’
			+ 触发的钩子函数
				- constructor
				- componentWillMount (废弃)
				- componentWillRecieveProps (废弃)
				- static getDerivedStateFromProps
				- shouldComponentUpdate
				- componentWillUpdate (废弃)
				- render
			+ 该阶段会被中断，恢复，重做， 所以协调阶段的生命周期钩子函数会被多次调用，建议不要在协调阶段的生命周期钩子里包含副作用；
		2. Commit（提交阶段）
			+ 将上一阶段计算出俩的要处理的  副作用（effects）一次性执行，这个极端必须同步执行，不能打断
			+ 触发的钩子函数
				- getSnapshotBeforeUpdate (严格来说，这个是在进入 commit 阶段前调用)
				- componentDidMount
				- componentDidUpdate
				- componentWillUnmount
			+ 该阶段要正确的处理副作用， DOM变更， 异步请求、useEffect中定义的副作用
	+ Reconciliation
		1. react中核心算法
	+ Double Buffering(双缓冲)
		1. WIP树
		2. 双缓存技术还有另外一个重要的场景就是异常的处理，比如当一个节点抛出异常，仍然可以继续沿用旧树的节点，避免整棵树挂掉。
	+ 副作用的收集和提交
		1. complateWork
		2. commitAllWork
4. 中断和恢复