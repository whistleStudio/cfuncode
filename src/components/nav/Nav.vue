<template>
<div class="nav">
  <!-- 隐藏组件 -->
  <UploadProgress v-show="isUploading" class="uploadProgress" :uploadPercent="uploadPercent"/>
  <context-holder />
  <a-modal v-model:open="isModalOpen" :title="modalInfo.title"  :okText="modalInfo.okText"
  :cancelText="modalInfo.cancelText" @ok="modalInfo.onOk" @cancel="modalInfo.onCancel"
  > 
    <a-input class="save-input" v-model:value="saveInputVal" placeholder="请输入项目名称"/>
  </a-modal>
  <a-modal v-model:open="isPrintOpen" title="串口打印" @ok="">  
    <div>xxxx</div>
  </a-modal>
  <!-- 显示组件 -->
  <div class="logo flex-v-center"></div>
  <div class="save flex-v-center">
    <a-input-group compact class="save-group">
      <a-input class="save-input" v-model:value="saveInputVal" placeholder="请输入项目名称"/>
      <a-tooltip title="保存">
        <a-button class="save-btn flex-v-center" @click="saveCode">
          <template #icon class="flex-v-center"><svg t="1719132633511" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13320" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M925.248 356.928l-258.176-258.176a64 64 0 0 0-45.248-18.752H144a64 64 0 0 0-64 64v736a64 64 0 0 0 64 64h736a64 64 0 0 0 64-64V402.176a64 64 0 0 0-18.752-45.248zM288 144h192V256H288V144z m448 736H288V736h448v144z m144 0H800V704a32 32 0 0 0-32-32H256a32 32 0 0 0-32 32v176H144v-736H224V288a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32V144h77.824l258.176 258.176V880z" p-id="13321"></path></svg></template>
        </a-button>
      </a-tooltip>
    </a-input-group>
  </div>
  <div class="mod flex-v-center">
    <a-segmented class="mod-seg flex-v-center" v-model:value="editAreaMod" :options="modOpt" @change="selectChange">
      <template #label="{ payload }">
        <div class="mod-item flex-v-center" :class="{'mod-item-select': editAreaMod==payload.val}">
          <svg v-if="payload.title == '积木'" t="1719110620485" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5083" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M866.367354 946.881939H237.906747c-13.747717 0-26.512808-7.226182-33.623919-18.932363-7.108525-11.783758-7.541657-26.435232-1.13907-38.57196l12.608646-23.881697c30.205414-57.072485 61.430949-116.068848 61.43095-144.938666 0-10.567111 0-15.358707-17.832081-15.358708-16.69301 0-33.270949 6.599111-38.022465 10.016324-20.975192 14.807919-51.259475 23.332202-83.114667 23.332202-32.443475 0-61.393455-8.680727-81.621333-24.432485-36.566626-28.593131-54.359919-87.669657-54.359919-180.602828 0-111.041939 62.846707-150.556444 121.646545-150.556445 20.817455 0 43.050667 4.94804 64.261172 14.374788 49.176566 21.800081 69.286788 21.01398 75.415273 20.111515 0.038788-0.550788 0.078869-1.177859 0.078868-1.925172 0.589576-74.786909-25.020768-248.595394-25.294868-250.32404a39.337374 39.337374 0 0 1 11.783757-34.210909C258.567758 122.930424 307.193535 82.747475 434.300121 82.747475c59.900121 0 89.752566 24.353616 104.207515 44.737939 16.889535 23.76404 21.132929 54.55903 11.429495 82.328566-23.134384 66.14497-25.844364 116.736-7.541656 142.504081 13.944242 19.678384 43.677737 29.655919 88.299313 29.655919 12.765091 0 40.025212-11.941495 60.529778-38.533172 18.813414-24.352323 37.392808-67.834828 19.325414-136.65099-6.481455-24.667798-1.140364-49.766141 15.004444-70.702545C751.71297 102.190545 803.05002 82.747475 866.367354 82.747475c36.372687 0 97.215354 0 146.549656 60.529778a39.377455 39.377455 0 0 1 8.838465 24.705292l1.727353 627.282748c0 83.664162-70.465939 151.616646-157.115474 151.616646z m-563.375839-78.558383h563.377131c42.577455 0 78.558384-33.427394 78.558384-72.940607l-1.689858-612.004202c-23.292121-22.074182-48.351677-22.074182-76.868526-22.074181-55.579152 0-78.990222 19.953778-79.932767 25.059555 20.503273 78.321778 8.759596 150.948202-33.034344 205.114182-32.364606 41.987879-80.559838 69.130343-122.706747 69.130343-71.527434 0-122.824404-21.132929-152.361374-62.767838-34.368646-48.469333-35.234909-120.467394-2.514747-213.951353 0.354263-1.021414 1.96396-6.284929-1.335596-10.920081-1.96396-2.750061-10.604606-11.666101-40.18295-11.666101-59.940202 0-95.839677 10.52703-114.53802 18.539313 7.385212 53.144566 22.900364 173.181414 22.388364 236.302222-0.35297 48.665859-33.110626 80.166788-83.467637 80.166788-27.729455 0-61.235717-8.87596-102.437495-27.141172-11.274343-4.988121-22.468525-7.620525-32.404687-7.620525-28.556929-0.038788-43.050667 24.157091-43.050666 71.960566 0 96.978747 21.721212 116.774788 24.195879 118.699959 4.94804 3.887838 17.164929 7.77697 33.229575 7.77697 17.361455 0 31.463434-4.438626 37.708283-8.917333 20.620929-14.611394 54.16598-24.431192 83.428849-24.431192 58.525737 0 96.389172 36.843313 96.389171 93.915798 0.001293 40.578586-22.976646 90.53996-52.750222 147.768889z" p-id="5084"></path></svg>
          <svg v-else t="1719110930657" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12310" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M288.256 216.064a51.2 51.2 0 0 0-72.192 8.192l-204.8 256a51.2 51.2 0 0 0 0 64l204.8 256a51.2 51.2 0 0 0 79.872-64L116.736 512l179.2-224.256a51.2 51.2 0 0 0-7.68-71.68zM1012.736 480.256l-204.8-256a51.2 51.2 0 0 0-79.872 64l179.2 223.744-179.2 224.256a51.2 51.2 0 0 0 79.872 64l204.8-256a51.2 51.2 0 0 0 0-64zM599.552 102.4a51.2 51.2 0 0 0-60.928 39.424l-153.6 716.8A51.2 51.2 0 0 0 424.448 921.6h10.752a51.2 51.2 0 0 0 51.2-40.448l153.6-716.8A51.2 51.2 0 0 0 599.552 102.4z" p-id="12311"></path></svg>
          <div>{{ payload.title }}</div>
        </div>
      </template>
    </a-segmented>
  </div>
  <div class="file flex-v-center">
    <ul class="flex-v-center">
      <li v-for="(v, i) in ['新建', '打开', '上传', '开始']" :key="v" class="flex-v-center" @click="navRMenuClick(v)" 
      v-show="i != 3-isOnlineRun">
        <!-- <img src="../../public/img/navr0.svg" alt=""> -->
        <img :src="getImageUrl(`navr${i}.svg`)" width="30px" :height="i==0 ? '25px' : '35px'">
        <span>{{ v }}</span>
      </li>
      <a-switch class="switch-mode" @change="switchChange()" v-model:checked="isOnlineRun" checked-children="在线调试" un-checked-children="脱机运行" />
      <a-dropdown placement="bottomLeft">
        <template #overlay>
          <a-menu > <!-- @click="handleMenuClick" -->
            <a-menu-item v-for="(v, i) in aMenuItemList" :key="i" @click="aMenuItemClick(i)">
              {{ v }}
            </a-menu-item>
          </a-menu>
        </template>
        <div class="file-help">
          <img src="/public/img/help.svg" width="30px" height="30px">
          <span>▾</span>
        </div>
      </a-dropdown>
    </ul>
    <input type="file" ref="fileRef" @change="fileChange" style="display: none;">
  </div>
</div> 
</template>


<script setup>
import * as Blockly from 'blockly/core';
import {pythonGenerator} from 'blockly/python'
import bus from "../../core/bus"
import {reactive, ref, defineEmits, defineProps, watch, onUnmounted, onMounted} from "vue"
import { message } from 'ant-design-vue';
import UploadProgress from "./UploadProgress.vue";
import sp from "../../core/sp"


const [messageApi, contextHolder] = message.useMessage();
const getImageUrl = (imgName) => {
  return new URL(`/public/img/${imgName}`, import.meta.url).href
}
const modOpt = ref([
  {
    value: 'block',
    payload: {
      title: '积木',
      val: "block"
    },
  },
  {
    value: 'code',
    payload: {
      title: '代码',
      val: "code"
    },
  }
]);
const editAreaMod = ref('block');
const emits = defineEmits(["showModChange", "updateProgress"])
const uploadPercent = ref(0), isUploading = ref(false)
const aMenuItemList = reactive([
  "连接串口", "调试工具", "固件上传", "帮助说明" 
])
const fileRef = ref(null), saveInputVal = ref(""), isSaved = ref(false)
const isModalOpen = ref(false), isPrintOpen = ref(false), isOnlineRun = ref(false)
const modalInfo = reactive({
  title: "当前内容已改变, 是否需要保存", okText: "保存", cancelText: "跳过",
  onOk: () => {saveCode(); location.reload()},
  onCancel: ev => {
    if (ev.target.innerHTML == "跳 过") location.reload()
    isModalOpen.value = false 
  }
})
/* 保存 */
function saveCode () {
  let workspaceJson = Blockly.serialization.workspaces.save(Blockly.getMainWorkspace())
  saveToFile(JSON.stringify(workspaceJson), saveInputVal.value)
  isSaved.value = true
  bus.code = pythonGenerator.workspaceToCode(Blockly.getMainWorkspace())
}

function saveToFile(content, fileName) {
  var blob = new Blob([content], { type: 'text/plain' });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  if (fileName) fileName += ".cfc"
  else fileName = "未命名程序.cfc"
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(link.href);
}
function fileChange(){
  const file = fileRef.value.files[0]
  // console.log(file)
  const fileReader = new FileReader()
  fileReader.addEventListener("load", ()=>{
    let workspaceJson = JSON.parse(fileReader.result)
    Blockly.serialization.workspaces.load(workspaceJson, Blockly.getMainWorkspace())
  })
  fileReader.readAsText(file)
}

/* 编辑区切换，子传父 */
function selectChange () {
  emits("showModChange", editAreaMod.value, isOnlineRun.value)
}
/* 新建/打开/上传 */
function navRMenuClick (v) {
  switch (v) {
    case "新建":
      if (bus.code == pythonGenerator.workspaceToCode(Blockly.getMainWorkspace())) location.reload()
      else isModalOpen.value = true
      break
    case "打开":
      fileRef.value.click()
      // let fileReader = new new FileReader()
      // fileReader.
      break
    case "上传":
      ;(async ()=>{
        if (sp.port) {
          uploadPercent.value = 0
          await sp.spUpload(
            () => {emits("showModChange", editAreaMod.value, isOnlineRun); isUploading.value = true}, //to app.vue
            curP => uploadPercent.value = curP
          )
          uploadPercent.value = 100
          setTimeout(()=>{isUploading.value = false},500)
      } else sp.spConnect(isOnlineRun.value, connectSuccess, connectFail)
      })()
      break
    case "开始":
      ;(async () => {
        if (sp.port) {
          await sp.spRun(
            () => {emits("showModChange", editAreaMod.value, isOnlineRun)}, //to app.vue
          )
        } else sp.spConnect(isOnlineRun.value, connectSuccess, connectFail)
      })()
      break
  }
}
/* 运行模式切换 */
function switchChange () {
  console.log("moshi", isOnlineRun.value)
  sp.spClose(() => aMenuItemList[0] = "连接串口")
}
/* aMenu */
function aMenuItemClick (i) {
  switch (i) {
    case 0: //连接串口/断开串口
      if (sp.port) {
        ;(async ()=>{
          try {
            await sp.spClose(connectFail)
          } catch(e){console.log(e)}
        })()
      } else sp.spConnect(isOnlineRun.value, connectSuccess, connectFail)
      break
    case (1): // 调试工具
      isPrintOpen.value = true
      break
    case (2): // 固件上传
      window.open("https://drive.weixin.qq.com/s?k=ANgAgQejAFQE5OIoKh", "_blank")
      break
    case (3): // 帮助说明
      window.open("https://cfunworld.com/#/documents", "_blank")
      break
  }
}

/* 连接/断开回调 */
function connectSuccess() {aMenuItemList[0] = "断开串口"; messageApi.info('设备已连接')}
function connectFail() {aMenuItemList[0] = "连接串口"; messageApi.info('设备已断开')}

onMounted(()=>{
  sp.checkBrowser(()=>messageApi.error("当前浏览器不支持串口功能"))
})

onUnmounted(() => {
  console.log("unmounted")
  sp.spClose(() => aMenuItemList[0] = "连接串口")
})
</script>


<style scoped lang="scss">
@import url('./nav.scss');
</style>
