import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import { fileURLToPath } from "url";
import { dirname, resolve as pathResolve } from "path";
import pkg from "./package.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "esm",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    alias({
      entries: [{ find: "@", replacement: pathResolve(__dirname, "src") }],
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
    }),
    resolve(),
    commonjs(),
  ],
};
