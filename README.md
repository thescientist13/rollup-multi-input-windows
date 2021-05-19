# rollup-multi-input-windows

## Overview
An example repo demonstrating an observed issue on _Windows_ OS when using [**rollup-plugin-multi-input**](https://github.com/alfredosalzillo/rollup-plugin-multi-input) and getting an `options.input` validation error from Rollup when using this configuration.

> _This could be related to a [similar comment](https://github.com/alfredosalzillo/rollup-plugin-multi-input/issues/15#issuecomment-660558275) found in the issue tracker, but not entirely certain._

```js
const multiInput = require('rollup-plugin-multi-input').default;
const path = require('path');

module.exports = {
  input: path.join(process.cwd(), 'src', '**/*.js'),
  output: {
    dir: path.join(process.cwd(), 'public'),
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js'
  },
  plugins: [
    multiInput()
  ]
};
```

```sh
$ npm run build

> rollup-multi-input-windows@1.0.0 build C:\Users\IEUser\Workspace\rollup-multi-input-windows
> rollup -c rollup.config.js

inputPath => C:\Users\IEUser\Workspace\rollup-multi-input-windows\src\**\*.js

C:\Users\IEUser\Workspace\rollup-multi-input-windows\src\**\*.js → public...
[!] Error: You must supply options.input to rollup
Error: You must supply options.input to rollup
    at Graph.generateModuleGraph (C:\Users\IEUser\Workspace\rollup-multi-input-windows\node_modules\rollup\dist\shared\rollup.js:18900:19)
    at async Graph.build (C:\Users\IEUser\Workspace\rollup-multi-input-windows\node_modules\rollup\dist\shared\rollup.js:18864:9)
    at async rollupInternal (C:\Users\IEUser\Workspace\rollup-multi-input-windows\node_modules\rollup\dist\shared\rollup.js:19939:9)
    at async build (C:\Users\IEUser\Workspace\rollup-multi-input-windows\node_modules\rollup\dist\bin\rollup:1464:20)
    at async runRollup (C:\Users\IEUser\Workspace\rollup-multi-input-windows\node_modules\rollup\dist\bin\rollup:1645:21)
```


> There is another issue that crops up that I can only reproduce in my [personal project]() and not in this repo, but will speak to that in the _Root Cause Analsys_ section.

## Setup
While on a Windows machine or [VM](https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/), do the following:

1. Clone this repo
1. Run `npm ci`
1. Run `npm run build`

Compared to running the same steps on macOS (and presumably any *nix based environment), where everything runs as expected.
```sh
TBD
```

## Root Cause Analysis

### Rollup options.input

My hunch is that this could be related to programatically handling path separators in NodeJS, as I found out recently myself in my [own project](https://github.com/ProjectEvergreen/greenwood/issues/600).

I noticed that if I forced all the path separators to `/` _first_, I could bypass the `options.input` error
```js
const multiInput = require('rollup-plugin-multi-input').default;
const path = require('path');

module.exports = {
  input: path.join(process.cwd(), 'src', '**/*.js').replace(/\\/g, '/'),

  ...

  plugins: [
    multiInput()
  ]
};
```

This addresses the immediate and Rollup passes successfully now.
```sh
$ npm run build

> rollup-multi-input-windows@1.0.0 build C:\Users\IEUser\Workspace\rollup-multi-input-windows
> rollup -c rollup.config.js

inputPath => C:/Users/IEUser/Workspace/rollup-multi-input-windows/src/**/*.js

C:/Users/IEUser/Workspace/rollup-multi-input-windows/src/**/*.js → public...
created public in 42ms
```

### TBD
This resolves the current issue here, but in my own project, I get a new Windows only error.
```
TBD
```