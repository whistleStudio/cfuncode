<template>
  <div class="title flex-v-center">
    <div @click="emit('back-click')">
      <svg t="1719646234154" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9263" width="30" height="30"><path d="M475 276V141.4c-12.1-56.3-58.2-22-58.2-22L96.6 395.9c-70.4 48.9-4.8 85.7-4.8 85.7l315.4 274.1c63.1 46.5 67.9-24.5 67.9-24.5V606.4C795.3 506 926.3 907.5 926.3 907.5c12.1 22 19.4 0 19.4 0C1069.4 305.4 475 276 475 276z" fill="#fff" p-id="9264"></path></svg>
    </div>
    <div>帮助</div>
  </div>
</template>


<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(["back-click"])

</script>


<style scoped lang="scss">
  .title {
    width: 100%;
    height: 55px;
    background-color: $mainColor;
    justify-content:space-between;
    padding: 0 25px;
    color: white;
    >div {
      cursor: pointer;
      svg {
        vertical-align: middle;
        width: 30px;
        height: 30px;
      }
    }
  }
</style>
