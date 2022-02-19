<script setup lang="ts">
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { UploadFilled } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import { useFFmpeg } from "../stores/ffmpeg";

let blobUrlArr: string[] = [];
let imgSrc = ref("");
let sliderMax = ref(10);
let imgSrcIndex = ref(1);
const ffmpegStore = useFFmpeg();

async function handleUploadGif({ raw }: { raw: File }) {
  const fileInfo = await ffmpegStore.getFileInfo(raw);
  blobUrlArr = await ffmpegStore.getGifFrames(raw);
  imgSrc.value = blobUrlArr[0] || "";
  sliderMax.value = blobUrlArr.length - 1;
  console.log(imgSrc);
}
function handleSliderChange(val: number): void {
  imgSrc.value = blobUrlArr[val];
}
</script>

<template>
  <el-upload
    class="upload-gif"
    drag
    action="#"
    accept=".gif"
    :show-file-list="false"
    :auto-upload="false"
    :on-change="handleUploadGif"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">gif files with a size less than 10mb</div>
    </template>
  </el-upload>
  <img :src="imgSrc" alt="加载中" />
  <el-slider
    v-model="imgSrcIndex"
    @change="handleSliderChange"
    :min="1"
    :max="sliderMax"
  ></el-slider>
</template>

<style scoped></style>
