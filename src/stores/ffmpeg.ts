import { defineStore } from "pinia";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const noop = () => {};

const ffmpeg = createFFmpeg({ corePath: "/ffmpeg-core.js" });
export const useFFmpeg = defineStore("ffmpeg", {
  state: () => {
    return {
      //
    };
  },
  actions: {
    exit() {
      if (ffmpeg.isLoaded()) {
        ffmpeg.exit();
      }
    },
    async load() {
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
        console.log("ffmpeg loaded");
      }
    },
    async getFileInfo(file: File): Promise<fileInfo> {
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
          /Stream #0:0: Video: gif, .*, (\d*)x(\d*).*, (\d*\.*\d*) fps, .*/;
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
    },
    async getGifFrames(file: File): Promise<string[]> {
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
          base64Arr.push(URL.createObjectURL(new Blob([data.buffer])));
        } catch (e) {
          break;
        }
      }
      return base64Arr;
    },
    async generateGifFromFrames(
      urlList: string[],
      fileInfo: fileInfo
    ): Promise<string> {
      const filename = fileInfo.filename.slice(0, -4);
      const fps = fileInfo.fps;
      for (let i = 0, length = urlList.length; i < length; i++) {
        ffmpeg.FS(
          "writeFile",
          `${filename}-image${i + 1}.png`,
          await fetchFile(urlList[i])
        );
      }
      await ffmpeg.run(
        "-r",
        fps.toString(),
        "-i",
        `${filename}-image%d.png`,
        `${filename}-gen.gif`
      );
      const data = ffmpeg.FS("readFile", `${filename}-gen.gif`);
      return URL.createObjectURL(new Blob([data.buffer]));
    },
  },
});
