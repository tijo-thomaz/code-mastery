import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@formlib": path.resolve(__dirname, "src/formlib"),
      "@kyclib": path.resolve(__dirname, "src/kyclib"),
      "@kycmodule": path.resolve(__dirname, "src/kycmodule"),
    },
  },
});
