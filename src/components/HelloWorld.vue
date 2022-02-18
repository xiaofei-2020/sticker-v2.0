<script setup lang="ts">
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { UploadFilled } from "@element-plus/icons-vue";

type fileInfo = {
  width: number;
  height: number;
  fps: number;
};

const noop = () => {};
const ffmpeg = createFFmpeg();
async function handleUploadGif({ raw }: { raw: File }) {
  const fileInfo = await getFileInfo(raw);
  console.log(fileInfo);
}
async function getFileInfo(file: File): Promise<fileInfo> {
  const { name: filename } = file;
  const fileInfo = {
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
</template>

<style scoped></style>
