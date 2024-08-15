function a () {
  return new Promise((rsv, rej)=>{
    console.log("xxxx")
    rsv(1)
  })
}

a()

async function b () {
  console.log("xxxxx")
}
b()
console.log("n")