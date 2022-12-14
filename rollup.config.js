import path from 'path'
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';
import rollup from 'rollup';
export default rollup.defineConfig([
    {
        input: './plugins/index.ts',
        output: [
            {
                file: path.resolve('./dist/index.cjs'),
                format: "cjs"
            },
            {
                file: path.resolve('./dist/index.mjs'),
                format: "es"
            }
        ],
        plugins: [terser(), typescript(), babel()]
    },
    {
        input: './plugins/index.ts',
        plugins: [dts.default()],
        output: {
            format: 'esm',
            file: 'dist/index.d.ts',
        }
    }
])