<script setup lang="ts">
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: true });
(async () => {
  await ffmpeg.load();
  ffmpeg.FS('writeFile', 'test.png', await fetchFile('/src/assets/24.gif'));
  await ffmpeg.run('-i', 'test.png');
})();
</script>

<template>
  <h1>hello</h1>
  <el-button>Default</el-button>
</template>

<style scoped></style>
