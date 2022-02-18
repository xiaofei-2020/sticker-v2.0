import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"; // vite.config.ts
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
// 自动导入element组件
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

const crossOriginIsolation = () => ({
  name: "configure-server",
  configureServer(server) {
    server.middlewares.use((_req, res, next) => {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    crossOriginIsolation(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
});
