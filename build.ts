import * as esbuild from 'esbuild';
import devConfig from './esbuild.dev';
import prodConfig from './esbuild.prod';

let devFlag = false;
let watchFlag = false;
for (const arg of process.argv) {
  if (arg.startsWith('--')) {
    if (arg === '--dev') {
      devFlag = true;
    }
    if (arg === '--watch') {
      watchFlag = true;
    }
  }
  if (arg.startsWith('-')) {
    if (arg === '-d') {
      devFlag = true;
    }
    if (arg === '-w') {
      watchFlag = true;
    }
  }
}

const config = devFlag ? devConfig : prodConfig;

(async () => {
  const ctx = await esbuild.context(config);

  if (devFlag && watchFlag) {
    await ctx.watch();
    console.log('Watching...');

    for await (const _ of process.stdin) {
      // manually rebuild
      await ctx.rebuild();
    }
  } else {
    await ctx.rebuild();
  }

  await ctx.dispose();
})();
