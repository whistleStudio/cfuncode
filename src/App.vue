<template>
  <div id="app">
    <Nav class="nav" @showModChange="showModChange" :code="code"/>
    <BlocklyWorkspace v-show="showMod == 'block'" :options="options" id="workspace" ref="blocklyWorkspace"/>
    <pre v-show="showMod == 'code'" id="code" v-html="code"></pre>
    <ExtLib class="ext-lib" />
  </div>
</template>

<script setup>
import bus from "./core/bus"
import * as libraryBlocks from 'blockly/blocks'; // 预制blocks必须
import './blocks/dsx_stock';
import './blocks/default_stock'
import toolboxJson from "./assets/toolbox.json"
import themeJson from "./assets/theme/theme.json"
import BlocklyWorkspace from "./components/blockly_workspace/BlocklyWorkspace.vue"
import "./core/custom_color"
import Nav from "./components/nav/Nav.vue";
import ExtLib from "./components/extLib/ExtLib.vue"
import { ref } from 'vue';
import {pythonGenerator} from 'blockly/python'
import { javascriptGenerator } from "blockly/javascript";
import myInterpreter from "./core/my_interpreter";

const options = {
  media: "/public/media/",
  renderer: "zelos",
  toolbox: toolboxJson,
  theme: themeJson,
  zoom: {
    controls: true,
    // wheel: true,
    startScale: 0.9,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2
  },
  maxInstances: {'dsx_start': 1}
}

/* 积木/代码 模式切换 */
const showMod = ref("block")
const blocklyWorkspace = ref(null)
const code = ref()

function showModChange(p) {
  showMod.value = p
  code.value = javascriptGenerator.workspaceToCode(blocklyWorkspace.value.workspace)
  bus.code = code.value
  myInterpreter.runCode(bus.code)
}



</script>

<style scoped lang="scss">
#app {
  width: 100vw;
  height: 100vh;
  .nav {
    height: $navH;
    // background-color: red;
  }
  #workspace {
    position: absolute;
    left: 0;
    top: $navH;
  }
  #code {
    padding: 10px;
    text-align: left;
    line-height: 14px;
  }
}
</style>
