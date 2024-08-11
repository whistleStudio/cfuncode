<template>
  <div class="uploadProgress">
    <div>{{ uploadPercent<100 ? "上传中":"上传成功" }}</div>
    <a-progress :percent="uploadPercent"       
    :stroke-color="{
        '0%': '#108ee9',
        '100%': '#87d068',
      }"
    />
  </div>
</template>


<script setup>
import { ref, defineProps } from 'vue';

const title = ref("上传中")
const {uploadPercent} = defineProps(["uploadPercent"])
</script>


<style scoped lang="scss">
.uploadProgress {
  font-size: 14px;
  width: 350px;
  height: 60px !important;
  background-color: #efefef;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
}

</style>
