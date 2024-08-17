function unsignedShortToByte2(s){
  var targets = [];
  targets[0] = (s & 0xFF);
  targets[1] = (s >> 8 & 0xFF);
  return targets;
}

function byte2ToUnsignedShort(arr){
  var s = 0;
  s += arr[1] << 8
  s += arr[0]
  return s;
}

function byteToDec(arr) {
  let s = 0, l = arr.length
  for (let i = l-1; i>=0; i--) {
    s += arr[i] << (8*i)
  }
  return s
}

let n1 = unsignedShortToByte2(10000)
let n2 = byteToDec(n1)
console.log(n1, n2)