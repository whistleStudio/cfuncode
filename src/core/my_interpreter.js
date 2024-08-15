/* 初始化自定义解释器 
参考: https://neil.fraser.name/software/JS-Interpreter/docs.html
*/
import sp from "./sp"

export default {
  runnerPid: 0,
  interpreter: null,

  runCode: function (code) {
    this.interpreter = new Interpreter(code, initApi)
    setTimeout(()=>{this.runner()}, 1) // 第一次执行，保证异步
  },

  runner: function () {
    if (this.interpreter) {
      const hasMore = this.interpreter.run()
      // console.log(hasMore)
      if (hasMore) {
        // Execution is currently blocked by some async call.
        // Try again later.
        this.runnerPid = setTimeout(this.runner, 10)
      } else this.reset()
    }
  },

  reset: function () {
    clearTimeout(this.runnerPid)
    this.interpreter = null
  }
}


function initApi(interpreter, globalObject) {
  // implementation: alert()
  var wrapper = function(text) {
    return window.alert(arguments.length ? text : '')
  }
  interpreter.setProperty(
    globalObject,
    'alert',
    interpreter.createNativeFunction(wrapper)
  )
  // implenmentation: console, console.log()
  var console = interpreter.nativeToPseudo({})
  interpreter.setProperty(globalObject, 'console', console)
  var wrapper = function (text) {
    return window.console.log(text)
  }
  interpreter.setProperty(
    console, 
    'log',
    interpreter.createNativeFunction(wrapper)
  )
  // implenmentation: spWrite()
  var wrapper = function (cmd) {
    window.console.log(cmd)
    let cmdArr  = cmd.split(",")
    sp.spWrite(cmdArr)
  }
  interpreter.setProperty(
    globalObject, 
    'spWrite',
    interpreter.createNativeFunction(wrapper)
  )
}

