import bus from "./bus";

export default {
  port: null,
  reader: null,
  isReading: false,
  curPercent: 0, 
  isUploading: false,
  USBVENDORID: 6790,
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
  spConnect: async function (success, fail) {
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
      success()
      this.listenReceived(fail)
    } catch (e) {
        console.log(e); // The prompt has been dismissed without selecting a device.
    }  
  },
  // 断开串口
  spClose: async function (fail) {
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
      this.reader.releaseLock();
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
    const writer = this.port.writable.getWriter()
    refreshCode()
    let codeArr = bus.code.split("\n")
    console.log(codeArr)
    this.curPercent = 0
    // this.isUploading = true
    const uploadStep = 100 / codeArr.length
    console.log("1", new Uint8Array([3, 7]).buffer)
    await writer.write(new Uint8Array([3, 7]).buffer)
    console.log("2")
    await msDelay(3000)
    console.log("3")
    for (let v of codeArr) {
      let lineU8Code = new TextEncoder().encode(v+"\n")
      await writer.write(lineU8Code.buffer)
      await msDelay(10)
      this.curPercent = parseInt(this.curPercent + uploadStep)
      updatePercent(this.curPercent)
    }
    console.log("4")
    await writer.write(new Uint8Array([170, 102]).buffer)
    console.log("5")
    await msDelay(80)
    // await writer.write(u8code) // 发送数据
    writer.releaseLock()
    console.log("6")
  } catch(e){}
  // this.isUploading = false
}


}

// 延时
function msDelay (t) {
  return new Promise((rsv, rej)=>{
    setTimeout(()=>{rsv()}, t)
  }).catch(()=>{console.log("delay err")})
}