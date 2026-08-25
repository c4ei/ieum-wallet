import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import version from "./version.json";

// Tauri 개발 서버에서 사용할 고정 포트입니다.
export default defineConfig({
  define: { __IEUM_DISPLAY_VERSION__: JSON.stringify(version.displayVersion) },
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: { ignored: ["**/src-tauri/**"] }
  }
});
