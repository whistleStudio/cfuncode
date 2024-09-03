/* 初始化自定义解释器 
参考: https://neil.fraser.name/software/JS-Interpreter/docs.html
注意: console重定义了，控制台打印window.console.log
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

  // implenmentation: spWrite() 通用8字节, 原始数据不需处理
  var wrapper = function (...cmd) {
    sp.spOut(cmd)
  }
  interpreter.setProperty(
    globalObject, 
    'spWrite',
    interpreter.createNativeFunction(wrapper)
  )

  // implenmentation: spRead() 
  var wrapper = function (tag, cmd0, cmd1, cmd2, cmd3, cmd4, cmd5, cmd6, cmd7, callback) {
    // window.console.log(cmd, tag)
    sp.readTag = tag
    sp.spOut([cmd0, cmd1, cmd2, cmd3, cmd4, cmd5, cmd6, cmd7])
    setTimeout(()=>{window.console.log("timeout readval:", sp.readVal);callback(sp.readVal)}, 120) // 延迟根据硬件传输与数据处理时长而定，需确保可靠返回
    return 0
  }
  interpreter.setProperty(
    globalObject, 
    'spRead',
    interpreter.createAsyncFunction(wrapper)
  )

  // implenmentation: spPwmWrite()
  var wrapper = function (pin, freq, duty) {
    let f = unsignedShortToByte2(freq)
    sp.spOut([255, 85, 130, pin, f[1], f[0], 0, duty])
  }
  interpreter.setProperty(
    globalObject, 
    'spPwmWrite',
    interpreter.createNativeFunction(wrapper)
  )

  // implenmentation: spOledStrWrite()
  var wrapper = function (x, y, optV, ctx) {
    const encoder = new TextEncoder()
    const ctxBytes = encoder.encode(ctx);
    const ctxL = ctx.length
    if (ctxL < 17) {
      var ctxBytesFill = Array(17-ctxL).fill(0)
    }
    sp.spOut([255, 85, 168, x, y, optV, ctxL, ...ctxBytes, ...ctxBytesFill])
  }
  interpreter.setProperty(
    globalObject, 
    'spOledStrWrite',
    interpreter.createNativeFunction(wrapper)
  )

  // implenmentation: spOledNumWrite()
  var wrapper = function (x, y, optV, num) {
    let numStr = floatToByte4(num)
    sp.spOut([255,85,169, x, y, optV, ...numStr])
  }
  interpreter.setProperty(
    globalObject, 
    'spOledNumWrite',
    interpreter.createNativeFunction(wrapper)
  )

  // implenmentation: spOledChWrite()
  var wrapper = function (x, y, optV, ctxCh) {
    const encoder = new TextEncoder()
    const ctxBytes = encoder.encode(ctxCh);
    const ctxChL = ctxCh.length
    if (ctxBytes.length < 33) {
      var ctxBytesFill = Array(33-ctxBytes.length).fill(0)
    }
    sp.spOut([255, 85, 170, x, y, optV, ctxChL, ...ctxBytes, ...ctxBytesFill])
  }
  interpreter.setProperty(
    globalObject, 
    'spOledChWrite',
    interpreter.createNativeFunction(wrapper)
  )

  // implenmentation: spMqttWrite()
  interpreter.setProperty(
    globalObject, 
    'spMqttWrite',
    interpreter.createNativeFunction((tag, b0, b1, b2, b3, ...args) => {
      let addArgs = []
      window.console.log(tag)
      const encoder = new TextEncoder()
      switch (tag) {
        case "wifiConnect":
          var [ssid, pwd] = args
          var ssidBytes = encoder.encode(ssid), pwdBytes = encoder.encode(pwd)
          addArgs = bytesArrAdd0([...ssidBytes, 0, ...pwdBytes, 0], 36)
          break
        case "mqttSet":
          var [username, id, pwd] = args
          var usernameBytes = encoder.encode(username), idBytes = encoder.encode(id), pwdBytes = encoder.encode(pwd)
          addArgs = bytesArrAdd0([...usernameBytes, 0, ...idBytes, 0, ...pwdBytes, 0], 36)
          break
        case "publishNum":
          var [topic, dataA, dataB, dataC, dataD] = args
          var topicBytes = encoder.encode(topic)
          addArgs = bytesArrAdd0([...topicBytes, 0, ...floatToByte4(dataA), ...floatToByte4(dataB), ...floatToByte4(dataC), ...floatToByte4(dataD), 0])
          break
      }
      sp.spOut([b0, b1, b2, b3, ...addArgs])
    })
  )
}



// 无符号short转双字节， 高左
function unsignedShortToByte2(s){
  var targets = [];
  targets[0] = (s >> 8 & 0xFF);
  targets[1] = (s & 0xFF);
  return targets;
}

// float32转uint8Array
function floatToByte4 (float_num) {
  var data = new Float32Array([float_num]);
  var buffer = new ArrayBuffer(data.byteLength);
  new Float32Array(buffer).set(data);
  return (new Uint8Array(buffer)).reverse();
}

// 补0
function bytesArrAdd0 (bytesArr, totalL) {
  if (bytesArr.length < totalL) {
    return [...bytesArr, ...(Array(totalL-bytesArr.length).fill(0))]
  }
  return bytesArr
}