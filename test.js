function uint8_to_float(buf) {
  buf.reverse();
  let buf32 =  new Float32Array(buf.buffer);
  return buf32[0];
}

console.log( (1<<4) + 1)