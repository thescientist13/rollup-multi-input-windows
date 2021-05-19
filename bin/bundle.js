const rollupConfig = require('../rollup.config');
const rollup = require('rollup');

async function bundle() {
  const bundle = await rollup.rollup(rollupConfig);
  await bundle.write(rollupConfig.output);
};

bundle();