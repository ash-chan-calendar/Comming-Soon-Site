import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import path from 'node:path';
import buildResultPlugin from './plugins/buildResultPlugin';
import copyPlugin from './plugins/copyPlugin';

const srcPath = path.join(__dirname, 'src');
const destPath = path.join(__dirname, 'dist');

const config: Partial<esbuild.BuildOptions> = {
  entryPoints: [
    { in: path.join(srcPath, 'index', 'index.html'), out: 'index' },
    { in: path.join(srcPath, 'index', 'style.scss'), out: 'index' },
    { in: path.join(srcPath, 'calendar', 'calendar.html'), out: 'calendar' },
    { in: path.join(srcPath, 'calendar', 'style.scss'), out: 'calendar' },
    { in: path.join(srcPath, 'calendar', 'main.ts'), out: 'calendar' },
  ],
  outdir: destPath,
  bundle: true,
  platform: 'browser',
  assetNames: 'assets/[name]-[hash]',
  chunkNames: '[ext]/[name]-[hash]',
  loader: {
    '.html': 'copy',
  },
  plugins: [
    sassPlugin(),
    buildResultPlugin(),
    copyPlugin({
      baseDir: srcPath,
      baseOutDir: destPath,
      files: [
        { from: 'imgs/**/*', to: '[path]/[name][ext]' },
        { from: 'favicon/**/*', to: '[path]/[name][ext]' },
      ],
    }),
  ],
};

export default config;
