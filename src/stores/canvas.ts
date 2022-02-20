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

      ctx.font="20px Georgia";
      ctx.fillText("Hello World!",10,50);

      return canvas.toDataURL();
    },
  },
});
