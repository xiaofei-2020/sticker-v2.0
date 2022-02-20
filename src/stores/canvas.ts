import { defineStore } from "pinia";

let canvas: HTMLCanvasElement = document.createElement("canvas");
let ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

interface composeImageAndTextOptions {
  imgWidth: number;
  imgHeight: number;
}
export const useCanvas = defineStore("canvas", {
  state: () => {
    return {
      //
    };
  },
  actions: {
    async composeImageAndText(
      imgEl: HTMLImageElement,
      text: string,
      options: composeImageAndTextOptions
    ): Promise<string> {
      const { imgWidth, imgHeight } = options;
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      ctx.drawImage(imgEl, 0, 0);
      // 文字基础样式
      ctx.textBaseline = "bottom";
      ctx.textAlign = "center";
      ctx.font = "bold 30px sans-serif";
      // 文字填充样式
      ctx.fillStyle = "#fff";
      ctx.fillText(text, imgWidth / 2, imgHeight);
      // 文字轮廓样式
      ctx.strokeStyle = "#000";
      ctx.strokeText(text, imgWidth / 2, imgHeight);

      return canvas.toDataURL();
    },
  },
});
