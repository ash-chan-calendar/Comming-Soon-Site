import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import path from 'node:path';
import buildResultPlugin from './plugins/buildResultPlugin';
import copyPlugin from './plugins/copyPlugin';

const srcPath = path.join(__dirname, 'src');
const destPath = path.join(__dirname, 'dist');

const config: Partial<esbuild.BuildOptions> = {
  entryPoints: [
    path.join(srcPath, 'calendar', 'main.ts')
  ],
  outdir: destPath,
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
        { from: 'index/index.html', to: 'index.html' },
        { from: 'calendar/calendar.html', to: 'calendar.html' },
      ],
    }),
    copyPlugin({
      baseDir: path.join(srcPath, 'res'),
      baseOutDir: destPath,
      files: [
        { from: '**/*', to: '[path]/[name][ext]' }
      ]
    }),
  ],
};

export default config;
