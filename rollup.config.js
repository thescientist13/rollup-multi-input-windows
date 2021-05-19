const multiInput = require('rollup-plugin-multi-input').default;
const path = require('path');

module.exports = {
  input: path.join(process.cwd(), 'www', '**/*.js'),
  output: {
    dir: path.join(process.cwd(), 'output'),
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js'
  },
  plugins: [
    multiInput()
  ]
};