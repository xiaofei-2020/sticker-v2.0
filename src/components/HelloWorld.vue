<script setup lang="ts">
import { UploadFilled } from "@element-plus/icons-vue";
import { reactive, ref, onMounted } from "vue";
import { useFFmpeg } from "../stores/ffmpeg";
import { useCanvas } from "../stores/canvas";
import { ElLoading } from "element-plus";

const ffmpegStore = useFFmpeg();
const canvasStore = useCanvas();

let blobUrlArr: string[] = [];
let imgSrc = ref("");
let sliderMax = ref(10);
let imgSrcIndex = ref(1);
let gifText = ref("");
let fileInfoObj: fileInfo;

// hooks
onMounted(
  loadingWrapper(async () => {
    await ffmpegStore.load();
  })
);

// Utils
function createImgEl(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    let imgEl = document.createElement("img");
    imgEl.src = url;
    imgEl.onload = () => {
      res(imgEl);
    };
  });
}

function loadingWrapper<T>(fn: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<T> {
  return async (...args) => {
    const loading = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    const data = await fn(...args);
    loading.close();
    return data;
  };
}

// 事件区
const handleUploadGif = loadingWrapper(async ({ raw }: { raw: File }) => {
  fileInfoObj = await ffmpegStore.getFileInfo(raw);
  blobUrlArr = await ffmpegStore.getGifFrames(raw);
  imgSrc.value = blobUrlArr[0] || "";
  sliderMax.value = blobUrlArr.length - 1;
});
function handleSliderChange(val: number): void {
  imgSrc.value = blobUrlArr[val];
}
const handleGenerate = loadingWrapper(async () => {
  const base64Arr: string[] = [];
  for (let url of blobUrlArr) {
    base64Arr.push(
      await canvasStore.composeImageAndText(
        await createImgEl(url),
        gifText.value,
        { imgWidth: fileInfoObj.width, imgHeight: fileInfoObj.height }
      )
    );
  }
  const blobUrl = await ffmpegStore.generateGifFromFrames(
    base64Arr,
    fileInfoObj
  );
  imgSrc.value = blobUrl;
  console.log("generated!");
});
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
  <el-input v-model="gifText" @keyup.enter="handleGenerate"></el-input>
  <el-button @click="handleGenerate">合成</el-button>
</template>

<style scoped></style>
