import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],

  format: ["esm", "cjs"],

  dts: true,
  sourcemap: true,
  clean: true,

  treeshake: true,
  splitting: true, // ✅ IMPORTANT for tree-shaking

  minify: true, // ✅ smaller bundle

  target: "es2020",

  banner: { js: '"use client";' },

  esbuildOptions(options) {
    options.jsx = "automatic";
  },

  external: [
    // React ecosystem
    "react",
    "react-dom",

    // MUI
    "@mui/material",
    "@mui/icons-material",

    // Emotion
    "@emotion/react",
    "@emotion/styled",

    // Tiptap (VERY IMPORTANT)
    /^@tiptap/,

    // Collaboration stack
    "yjs",
    "y-protocols",

    // Syntax highlighting
    "lowlight",
    "highlight.js",
  ],
});