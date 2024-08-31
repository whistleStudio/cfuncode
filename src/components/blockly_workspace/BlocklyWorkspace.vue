<template>
  <div class="blocklyWorkspace">
    <div class="blocklyDiv" ref="blocklyDiv">
    </div>
  </div>
</template>


<script setup>
import {onMounted, ref, shallowRef} from 'vue'
import * as Blockly from 'blockly/core';
import * as Zh from "blockly/msg/zh-hans"
import toolboxJson from "../../assets/toolbox.json"
import bus from "../../core/bus"
import customToolboxJson from "../../blocks/customToolbox.json"

/* 语言，色调设置 */
Blockly.setLocale(Zh)
Blockly.utils.colour.setHsvSaturation(0.6)
Blockly.utils.colour.setHsvValue(0.68)
Blockly.BlockSvg.START_HAT = true

const props = defineProps(['options'])
const blocklyDiv = ref()
const workspace = shallowRef()
let mainWorkspace = null

defineExpose({workspace})

/* 监听：打开扩展窗口 */
function onOpenExtLib (ev) {
  // console.log(ev)
  if (ev.type == "toolbox_item_select") {
    // console.log(ev.newItem)
    if (ev.newItem == "扩展") {
      bus.emit("openExtLib")
    }
  }  
}
/* 总线：添加扩展 */
function addExt ({extIdx, extSta, extIcon}) {
  console.log("addExt")
  const l = toolboxJson.contents.length
  // let curExt = []
  switch (extIdx) {
    case 0:
      for (let i in Array(6).fill(0)) { // 大师兄模块组
        if (extSta) {
          toolboxJson.contents.push(customToolboxJson.contents[i])
          cateIconClassList.push(extIcon)
          // curExt = customToolboxJson.contents.slice(0, 2)
          // toolboxJson.contents.splice(l, 0, ...curExt)
          // cateIconClassList.push(extIcon)
        } else {
          toolboxJson.contents.pop()
          cateIconClassList.pop()
        }
      }
      workspace.value.updateToolbox(toolboxJson)
      addCateIcon() //默认类目图标
      break
  }
}

/* 目录添加图标 */
const cateIconClassList = ["iconLoop", "iconLogic", "iconMath", "iconText", "iconList", "iconVariable", "iconProcedure", "iconExt"] // 图标样式，关联style.css

function addCateIcon () {
  const blocklyTreeIconList = document.getElementsByClassName("blocklyTreeIcon")
  for (let i in cateIconClassList) {
    blocklyTreeIconList[i].classList.add(cateIconClassList[i])
  }
}

onMounted(() => {
  const options = props.options
  workspace.value = Blockly.inject(blocklyDiv.value, options)
  mainWorkspace = Blockly.getMainWorkspace()
  mainWorkspace.addChangeListener(Blockly.Events.disableOrphans) // 游离积木无效
  mainWorkspace.addChangeListener(onOpenExtLib) 
  // console.log("---", mainWorkspace.getToolbox().getToolboxItems()[0].iconDom_)
  //<span class="blocklyTreeIcon" role="presentation" style="display: inline-block;"></span>
  // console.log("getICon---", document.getElementsByClassName("blocklyTreeIcon")[0].style.color)
  // document.getElementsByClassName("blocklyTreeIcon")[0].classList.add("svgimg")
  addCateIcon()
  bus.on("addExt", addExt)
});

</script>


<style scoped lang="scss">
.blocklyWorkspace {
  width: 100%;
  height: calc(100% - $navH);
  .blocklyDiv {
    width: 100%;
    height: 100%;
    text-align: left; // 左对齐会让垂直滚动条显示出来，否则得改源码
  }
}



</style>
