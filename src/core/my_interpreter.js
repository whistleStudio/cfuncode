/* 初始化自定义解释器 
参考: https://neil.fraser.name/software/JS-Interpreter/docs.html
*/

import sp from "./sp"

export default {
  runnerPid: 0,
  interpreter: null,

  runCode: function (code) {
    this.interpreter = new Interpreter(code, initApi)
    this.runnerPid = setTimeout(()=>{this.runner()}, 1) // 第一次执行，保证异步
  },

  runner: function () {
    if (this.interpreter) {
      const hasMore = this.interpreter.run()
      // console.log("block by async:", hasMore)
      if (hasMore) {
        // Execution is currently blocked by some async call.
        // Try again later.
        clearTimeout(this.runnerPid)
        this.runnerPid = setTimeout(()=>{this.runner()}, 1)
      } else this.reset()
    }
    // -- debug功能用 --
    // if (this.interpreter.step()) {
    //   setTimeout(()=>{this.runner()}, 1);
    // } else this.reset()
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
    return window.console.log("print", text)
  }
  interpreter.setProperty(
    console, 
    'log',
    interpreter.createNativeFunction(wrapper)
  )

  // implenmentation: delayMs()
  var wrapper = interpreter.createAsyncFunction(
    function (timeInSeconds, callback) {
      // Delay the call to the callback. 
      // 文档: run()过程中，自定义解释器遇到异步, setTimeout/setInterval会阻塞，callback(如果异步有返回值传这里)回调的就是剩下的代码
      setTimeout(callback, timeInSeconds * 1000);
    },
  );
  interpreter.setProperty(globalObject, 'delayMs', wrapper);

  // implenmentation: spWrite()
  var wrapper = function (cmd) {
    window.console.log(cmd)
    let cmdArr  = cmd.split(",")
    sp.spOut(cmdArr)
  }
  interpreter.setProperty(
    globalObject, 
    'spWrite',
    interpreter.createNativeFunction(wrapper)
  )

  // implenmentation: spRead()
  var wrapper = function (cmd, tag, callback) {
    window.console.log(cmd, tag)
    sp.readTag = tag
    let cmdArr  = cmd.split(",")
    sp.spOut(cmdArr)
    setTimeout(()=>{window.console.log("timeout readval:", sp.readVal);callback(sp.readVal)}, 20)
    return 0
  }
  interpreter.setProperty(
    globalObject, 
    'spRead',
    interpreter.createAsyncFunction(wrapper)
  )
}

