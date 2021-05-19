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

### Observations
I noticed that if I logged `input` as such, it would return as an empty object
```js
console.debug('???? input ', input);
return {
  ...conf,
  input,
};
```

```sh
???? input  {}
```
### Rollup options.input

My hunch is that this could be related to programatically handling path separators in NodeJS, as I found out recently myself in my [own project](https://github.com/ProjectEvergreen/greenwood/issues/600).

<details>
For example, here is what the `input` returned from the plugin looks like on Windows on my project

```sh
input: {
    '..\\.greenwood\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/index.html',
    '..\\.greenwood\\about\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/about/index.html',
    '..\\.greenwood\\docs\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/docs/index.html',
    '..\\.greenwood\\getting-started\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/getting-started/index.html',
    '..\\.greenwood\\guides\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/guides/index.html',
    '..\\.greenwood\\plugins\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/plugins/index.html',
    '..\\.greenwood\\about\\community\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/about/community/index.html',
    '..\\.greenwood\\about\\features\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/about/features/index.html',
    '..\\.greenwood\\about\\goals\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/about/goals/index.html',
    '..\\.greenwood\\about\\how-it-works\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/about/how-it-works/index.html',
    '..\\.greenwood\\docs\\component-model\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/docs/component-model/index.html',
    '..\\.greenwood\\docs\\configuration\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/docs/configuration/index.html',
    '..\\.greenwood\\docs\\css-and-images\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/docs/css-and-images/index.html',
    '..\\.greenwood\\docs\\data\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/docs/data/index.html',
    '..\\.greenwood\\docs\\front-matter\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/docs/front-matter/index.html',
    '..\\.greenwood\\docs\\layouts\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/docs/layouts/index.html',
    '..\\.greenwood\\docs\\markdown\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/docs/markdown/index.html',
    '..\\.greenwood\\docs\\menus\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/docs/menus/index.html',
    '..\\.greenwood\\docs\\tech-stack\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/docs/tech-stack/index.html',
    '..\\.greenwood\\getting-started\\branding\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/getting-started/branding/index.html',
    '..\\.greenwood\\getting-started\\build-and-deploy\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/getting-started/build-and-deploy/index.html',
    '..\\.greenwood\\getting-started\\creating-content\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/getting-started/creating-content/index.html',
    '..\\.greenwood\\getting-started\\key-concepts\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/getting-started/key-concepts/index.html',
    '..\\.greenwood\\getting-started\\next-steps\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/getting-started/next-steps/index.html',
    '..\\.greenwood\\getting-started\\project-setup\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/getting-started/project-setup/index.html',
    '..\\.greenwood\\getting-started\\quick-start\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/getting-started/quick-start/index.html',
    '..\\.greenwood\\guides\\cloudflare-workers-deployment\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/guides/cloudflare-workers-deployment/index.html',
    '..\\.greenwood\\guides\\firebase\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/guides/firebase/index.html',
    '..\\.greenwood\\guides\\netlify-cms\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/guides/netlify-cms/index.html',
    '..\\.greenwood\\guides\\netlify-deploy\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/guides/netlify-deploy/index.html',
    '..\\.greenwood\\guides\\now\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/guides/now/index.html',
    '..\\.greenwood\\guides\\s3-cloudfront\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/guides/s3-cloudfront/index.html',
    '..\\.greenwood\\plugins\\custom-plugins\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/plugins/custom-plugins/index.html',
    '..\\.greenwood\\plugins\\resource\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/plugins/resource/index.html',
    '..\\.greenwood\\plugins\\rollup\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/plugins/rollup/index.html',
    '..\\.greenwood\\plugins\\server\\index': 'C:/Users/IEUser/Workspace/greenwood/.greenwood/plugins/server/index.html'
  },
```

As opposed to macOS
```sh
```
</details>

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
> rollup-multi-input-windows@1.0.0 build C:\Users\IEUser\Workspace\rollup-multi-input-windows
> rollup -c rollup.config.js

inputPath => C:/Users/IEUser/Workspace/rollup-multi-input-windows/src/**/*.js

C:/Users/IEUser/Workspace/rollup-multi-input-windows/src/**/*.js → public...
@@@@@@ INSIDE PLUGIN options.input @@@@@@@ C:/Users/IEUser/Workspace/rollup-multi-input-windows/src/**/*.js
globs [ 'C:/Users/IEUser/Workspace/rollup-multi-input-windows/src/**/*.js' ]
others []
???? filepath index.js
???? filepath scripts\user.js
???? input  {
  index: 'C:/Users/IEUser/Workspace/rollup-multi-input-windows/src/index.js',
  'scripts\\user': 'C:/Users/IEUser/Workspace/rollup-multi-input-windows/src/scripts/user.js'
}
created public in 75ms
```

### TBD
This resolves the current issue here, but in my own project, I get a new Windows only error.
```sh
# current
input: 'C:\\Users\\IEUser\\Workspace\\rollup-multi-input-windows\\src\\**\\*.js',
```

```
Error: Invalid substitution "..\.greenwood\index" for placeholder "[name]" in "output.entryFileNames" pattern, can be neither absolute nor relative path.
```