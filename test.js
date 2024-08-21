var optArr = Array(16).fill(0).map((v, i) => String(i))
// console.log(optArr)

function genOpt (arr) {
  return arr.map(v => [v, v])
}
console.log(genOpt(optArr))