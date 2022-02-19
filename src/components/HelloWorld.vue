<script setup lang="ts">
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { UploadFilled } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
type fileInfo = {
  filename: string;
  width: number;
  height: number;
  fps: number;
};

const noop = () => {};
const ffmpeg = createFFmpeg();
let blobUrlArr: string[] = [];
let imgSrc = ref("");
let sliderMax = ref(10);
let imgSrcIndex = ref(1);

async function handleUploadGif({ raw }: { raw: File }) {
  const fileInfo = await getFileInfo(raw);
  blobUrlArr = await getGifFrames(raw);
  imgSrc.value = blobUrlArr[0] || "";
  sliderMax.value = blobUrlArr.length - 1;
  console.log(imgSrc);
  ffmpeg.exit();
}
async function getFileInfo(file: File): Promise<fileInfo> {
  const { name: filename } = file;
  const fileInfo = {
    filename,
    width: 0,
    height: 0,
    fps: 0,
  };
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
  ffmpeg.FS("writeFile", filename, await fetchFile(file));
  ffmpeg.setLogger(({ type, message }) => {
    const infoReg =
      /Stream #0:0: Video: gif, .*, (\d*)x(\d*), (\d*\.*\d*) fps, .*/;
    const s = message.match(infoReg);
    if (s !== null) {
      if (s[1] !== undefined) fileInfo.width = Number(s[1]);
      if (s[2] !== undefined) fileInfo.height = Number(s[2]);
      if (s[3] !== undefined) fileInfo.fps = Number(s[3]);
    }
  });
  await ffmpeg.run("-i", filename);
  ffmpeg.setLogger(noop);
  return fileInfo;
}
async function getGifFrames(file: File): Promise<string[]> {
  const { name: filename } = file;
  const base64Arr: string[] = [];
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
  ffmpeg.FS("writeFile", filename, await fetchFile(file));
  await ffmpeg.run("-i", filename, `${filename.slice(0, -4)}image%d.png`);
  let i = 0;
  while (++i) {
    try {
      const data = ffmpeg.FS(
        "readFile",
        `${filename.slice(0, -4)}image${i}.png`
      );
      base64Arr.push(
        URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
      );
    } catch (e) {
      break;
    }
  }
  return base64Arr;
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
