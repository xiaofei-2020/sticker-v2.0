import { defineStore } from 'pinia'
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

type fileInfo = {
  filename: string;
  width: number;
  height: number;
  fps: number;
};
const noop = () => {};

const ffmpeg = createFFmpeg();
export const useFFmpeg = defineStore('ffmpeg', {
  state: () => {
    return { 
      //
    }
  },
  actions: {
    exit() {
      if (ffmpeg.isLoaded()) {
        ffmpeg.exit();
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
          base64Arr.push(
            URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
          );
        } catch (e) {
          break;
        }
      }
      return base64Arr;
    }
  },
})