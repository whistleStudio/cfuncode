import bus from "./bus";
import myInterpreter from "./my_interpreter";


export default {
  port: null,
  reader: null,
  writer: null,
  isReading: false,
  curPercent: 0, 
  isUploading: false,
  USBVENDORID: 6790,
  readTag: null,
  readVal: 0,
  chunk:[],
  // 浏览器校验
  checkBrowser: function (cb) {
    if (!"serial" in navigator) {
      cb()
      // messageApi.error("当前浏览器不支持串口功能")
    }
  },
  // 设备插入监听
  spOnConnect: function (cb) {
    navigator.serial.onconnect = (ev) => {
      console.log("Serial connected: ", ev.target, ev.target.getInfo());
      cb(ev)
    }
  },
  // 设备拔出监听
  spOnDisconnect: function (cb) {
    navigator.serial.onconnect = (ev) => {
      console.log("Serial connected: ", ev.target, ev.target.getInfo());
    }
    cb(ev)
  },
  // 串口连接
  spConnect: async function (isOnlineRun, success, fail) {
    try {
      this.port = await navigator.serial.requestPort({ filters: [{ usbVendorId: this.USBVENDORID }] }); // 弹出系统串口列表对话框，选择一个串口进行连
      console.log("*******", this.port.getInfo())
      if (this.port === null) {
        console.log("串口已断开");
        return;
      }
      await this.port.open({
        baudRate: 115200,
        // bufferSize: 255,   // 读写缓存，默认255
        // dataBits: 8,       // 数据位，默认8
        // flowControl: none, // 流控制，默认无
        // parity: none,      // 校验，默认无
        // stopBits: 1,       // 停止位，默认1
      });
      if (isOnlineRun) {
        this.writer = this.port.writable.getWriter()
        console.log("#Online start")
        await this.writer.write(new Uint8Array([3, 7]).buffer)
        console.log("2")
        await msDelay(3000)
        console.log("3")
        let lineU8Code = new TextEncoder().encode("#Online interaction\n")
        await this.writer.write(lineU8Code.buffer)
        await msDelay(10)
        await this.writer.write(new Uint8Array([170, 102]).buffer)
        console.log("#Online ready")
        await msDelay(80)           
      }
      success()
      this.listenReceived(fail)
    } catch (e) {
        console.log(e); // The prompt has been dismissed without selecting a device.
    }  
  },
  // 断开串口
  spClose: async function (fail) {
    console.log("spclose")
    if ((this.port === null) || (!this.port.writable)) {
      console.log("Not opened.");
      return;
    }
    if (this.isReading) {
      this.isReading = false;
      console.log("reader", this.reader)
      this.reader.cancel().catch(e => {console.log(e);fail();this.port = null})
    }
  },
  // 读取数据(包含了断开实现)
  listenReceived: async function (fail) {
    if (this.isReading) {
    console.log("On Reading.");
    return;
    }
    this.isReading = true;
    while (this.port.readable && this.isReading) {
      this.reader = this.port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await this.reader.read();
          // 解析串口读取数值 高位左
          if (this.readTag) {
            this.chunk = [...this.chunk, ...value]
            if (this.chunk.length == 8) { // 大多数读取适配
              console.log("sp read:", this.chunk) // 有时会丢数据需要额外处理
              switch (this.readTag) {
                case "tag_bool":
                  this.readVal = this.chunk[7]
                  break
                case "tag_short":
                  this.readVal = byteToDec([this.chunk[6], this.chunk[7]])
                  break
                case "tag_int":
                  this.readVal = byteToDec([this.chunk[4], this.chunk[5], this.chunk[6], this.chunk[7]])
                  break
              }
              this.readTag = null
              this.chunk = []
            }
          } else this.chunk = []
          if (done) {
            // |reader| has been canceled.
            break;
          }
          // 需要特别注意的是：实际使用中即使对端是按一个个包发送的串口数据，接收时收到的也可能是分多段收到的
          // updateInputData(value);
        }
      } catch (e) {
        console.log(e);this.isReading = false;
      } finally {
        console.log("releaselock")
        this.reader.releaseLock();
        this.writer.releaseLock()
      }
    }
    await this.port.close(); // 关闭串口
    this.port = null;
    fail()
  },
  // 上传代码
  spUpload: async function (refreshCode, updatePercent) {
    if ((this.port === null) || (!this.port.writable)) {
      console.log("Not opened.")
      return;
    }
    try {
      this.writer = this.port.writable.getWriter()
      refreshCode()
      let codeArr = bus.code.split("\n")
      console.log(codeArr)
      this.curPercent = 0
      // this.isUploading = true
      const uploadStep = 100 / codeArr.length
      console.log("#Upload start")
      await this.writer.write(new Uint8Array([3, 7]).buffer)
      await msDelay(3000)
      for (let v of codeArr) {
        let lineU8Code = new TextEncoder().encode(v+"\n")
        await this.writer.write(lineU8Code.buffer)
        await msDelay(10)
        this.curPercent = parseInt(this.curPercent + uploadStep)
        updatePercent(this.curPercent)
      }
      await this.writer.write(new Uint8Array([170, 102]).buffer)
      await msDelay(80)
      // await writer.write(u8code) // 发送数据
      this.writer.releaseLock()
      console.log("#Upload over")        
    } catch(e){}
  // this.isUploading = false
  },
  // 在线调试
  spRun: async function (refreshCode) {
    if ((this.port === null) || (!this.port.writable)) {
      console.log("Not opened.")
      return;
    }
    refreshCode()
    await msDelay(100)
    myInterpreter.runCode(bus.code)
  },
  // 在线： 写单行
  spOut: function (data) {
    if ((this.port === null) || (!this.port.writable)) {
      console.log("Not opened.")
      return;
    }
    this.writer.write(new Uint8Array(data).buffer)
    console.log("write ok:", new Uint8Array(data))
  }
}

// 延时
function msDelay (t) {
  return new Promise((rsv, rej)=>{
    setTimeout(()=>{rsv()}, t)
  }).catch(()=>{console.log("delay err")})
}

// 字节转short 
function byte2ToUnsignedShort(arr){
  var s = 0;
  s += arr[1] << 8
  s += arr[0]
  return s;
}

function byteToDec(arr) {
  let s = 0, l = arr.length
  for (let i=0; i<l-1; i++) {
    s += arr[i] << (8*(l-1-i))
  }
  return s
}