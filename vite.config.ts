import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

// https://vite.dev/config/
export default defineConfig({
  fmt: {
    // Favour one entry per line with a trailing comma, so additions and
    // removals touch a single line. Oxfmt has no option that forces every
    // list to expand; a narrow print width, trailing commas everywhere,
    // preserved multi-line objects, and one attribute per line push furthest
    // that way.
    printWidth: 80,
    trailingComma: "all",
    objectWrap: "preserve",
    singleAttributePerLine: true,
  },
  lint: {
    plugins: ["react", "typescript", "oxc"],
    rules: {
      "react/rules-of-hooks": "error",
      "react/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  plugins: lazyPlugins(() => [react()]),
});
