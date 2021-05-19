const multiInput = require('rollup-plugin-multi-input').default;
const path = require('path');

let inputPath = path.join(process.cwd(), 'src', '**/*.js');

// resolves rollup missing options.input validation error
// inputPath = inputPath.replace(/\\/g, '/');

console.log(`inputPath => ${inputPath}`);

module.exports = {
  input: inputPath,
  output: {
    dir: path.join(process.cwd(), 'public'),
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js'
  },
  plugins: [
    multiInput()
  ]
};