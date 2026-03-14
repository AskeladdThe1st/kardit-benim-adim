const { cpSync, existsSync, readdirSync, rmSync } = require("fs");
const { resolve } = require("path");
const { defineConfig } = require("vite");

const rootDir = __dirname;
const staticDirs = ["css", "fonts", "images", "js"];

const input = Object.fromEntries(
  readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => [entry.name.replace(/\.html$/, ""), resolve(rootDir, entry.name)])
);

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input,
    },
  },
  plugins: [
    {
      name: "copy-legacy-static-folders",
      closeBundle() {
        const distDir = resolve(rootDir, "dist");

        staticDirs.forEach((dirName) => {
          const sourceDir = resolve(rootDir, dirName);
          const targetDir = resolve(distDir, dirName);

          if (!existsSync(sourceDir)) {
            return;
          }

          rmSync(targetDir, { recursive: true, force: true });
          cpSync(sourceDir, targetDir, { recursive: true });
        });
      },
    },
  ],
});
