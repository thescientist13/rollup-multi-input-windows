const multiInput = require('rollup-plugin-multi-input').default;
const path = require('path');

const inputPath = path.join(process.cwd(), 'app', '**/*.js');
console.log(`inputPath => ${inputPath}`);

module.exports = {
  input: inputPath,
  output: {
    dir: path.join(process.cwd(), 'output'),
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js'
  },
  plugins: [
    multiInput()
  ]
};