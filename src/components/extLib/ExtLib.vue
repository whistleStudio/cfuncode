<template>
  <a-drawer class="drawer"
    placement="top" :closable="false" :open="open" :maskClosable="false"
    height = "100%" :headerStyle="headerStyle"
    @close="onClose"
  >
    <template v-slot:title><ExtLibTitle @back-click="open=false"/></template>
    <ul class="cardbox">
      <li v-for="(v, i) in cardList" :key="v" @click="cardClick(i)">
        <a-card  class="card" hoverable >
          <template #cover class="card-img">
            <img alt="example" :src="getImageUrl(v.src)"/>
          </template>
          <a-card-meta :title="v.title">
            <template #description>{{ v.des }}</template>
          </a-card-meta>
        </a-card>
        <div class="loadState" v-show="extSta[i]">已加载</div>
      </li>
    </ul>
  </a-drawer>
</template>


<script setup>
import { reactive, ref } from 'vue';
import ExtLibTitle from './ExtLibTitle.vue';
import extCardJson from "./extCard.json"
import bus from "../../core/bus"

const open = ref(false);
const headerStyle = {padding: 0}
const cardList = extCardJson.cards
const getImageUrl = (imgUrl) => {
  return new URL(imgUrl, import.meta.url).href
}

let extSta = reactive(new Array(cardList.length).fill(false)) 
console.log(extSta)

const onClose = () => {
  open.value = false;
};

bus.on("openExtLib", () => {open.value = true; console.log("trigger")})

function cardClick (i) {
  open.value = false
  extSta[i] = !extSta[i]
  bus.emit("addExt", {extIdx:i, extSta:extSta[i], extIcon: cardList[i].iconClassName})
}
</script>


<style scoped lang="scss">
.drawer {
  .cardbox {
    display: flex;
    flex-wrap: wrap;
    >li {
      $liW: 19%;
      width: $liW;
      margin-bottom: calc((100% - $liW*5) / 4);
      position: relative;
      &:not(:nth-of-type(5n)) {
        margin-right: calc((100% - $liW*5) / 4);
      }
      .card {
        width: 100%;
        height: 300px;
        padding: 0;
        img {
          height: 200px;
          object-fit: contain;
        }
      }
      .loadState {
        position: absolute;
        text-align: center;
        color: white;
        font: bold 14px/30px "微软雅黑","Microsoft YaHei";
        width: 80px;
        background-color: orange;
        border-radius: 5px;
        top: 15px;
        left: 15px;
      }
    }
  }
}  

</style>
