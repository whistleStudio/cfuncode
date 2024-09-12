// let text = "你"
// const encoder = new TextEncoder()
// text = encoder.encode(text) // 转u8array
// // text = Array.prototype.map.call(text, v => v.toString(16).slice(-2)).join("") // 转hex字符串
// console.log(text)

import str2gbk from 'str2gbk'

let text = str2gbk('你好')  // Uint8Array(7) [ 196, 227,   186, 195,   49, 50, 51 ]
text = Array.prototype.map.call(text, v => v.toString(16)).join("") // 转hex字符串
console.log(text)