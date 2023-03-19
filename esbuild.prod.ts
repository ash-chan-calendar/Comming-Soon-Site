import * as esbuild from 'esbuild';
import commonConfig from './esbuild.common';

const config: esbuild.BuildOptions = {
  ...commonConfig,
  sourcemap: 'linked',
  minify: true,
};

export default config;
