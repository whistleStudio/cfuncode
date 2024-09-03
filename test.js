function byteToFloat(buf) {
  buf.reverse();
  var view = new DataView(new ArrayBuffer(buf.length))
  for (var i = 0; i < buf.length; i++) {
    view.setUint8(i, buf[i]);
  }
  return view.getFloat32()
}

console.log(byteToFloat([0, 0, 7, 67]))