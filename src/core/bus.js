export default {
  evlist: {},
  // 注册监听事件；同一主题，允许多个订阅者，所以是事件组
  on: function (name, cb) {
    console.log("on", name)
    let fnArr = this.evlist[name] || []
    fnArr.push(cb)
    this.evlist[name] = fnArr //初次注册主题需要
  },
  // 触发事件；不同订阅者触发不同事件
  emit: function (name, ...args) {
    console.log("emit:", name)
    let fnArr = this.evlist[name]
    console.log(fnArr)
    fnArr.forEach(cb => {
      cb.apply(this, args)
    });
  },

  code: ""
}