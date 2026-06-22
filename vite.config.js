import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/build-a-modern-startup-investment-portfolio-tracker-for-venture-capitalists-the-ui-must-be-stunning/",
  build: { outDir: "dist", assetsDir: "assets" },
  server: { port: 3000 },
});
