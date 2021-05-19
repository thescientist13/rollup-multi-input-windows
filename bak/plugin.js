import * as fastGlob from 'fast-glob';
import path from 'path';
import isString from 'lodash/isString';
import partition from 'lodash/partition';
import { name as pluginName } from '../package.json';
import { partialRight } from 'lodash';

/**
 * default multi-input Options
 * */
const defaultOptions = {
  relative: `src${path.sep}`,
};

// extract the output file name from a file name
const outputFileName = (filePath) => filePath
  .replace(/\.[^/.]+$/, '')
  .replace(/\\/g, '/');

/**
 * Callback for transforming output file path
 *
 * @callback TransformOutputPathFn
 * @param {string} output target file name
 * @param {string} input source file name
 */

/**
 *  multiInput is a rollup plugin to use multiple entry point and preserve the directory
 *  structure in the dist folder
 *
 *  @param {?Object} options
 *  @param {?FastGlob.Options} options.glob - the fast-glob configuration object
 *  @param {?string} options.relative - the base path to remove in the dist folder
 *  @param {?TransformOutputPathFn} options.transformOutputPath - callback function to
 *      transform the destination file name before generation
 *  @return {Plugin} - the rollup plugin config for enable support of multi-entry glob inputs
 * */
export default ({
  glob: globOptions,
  relative = defaultOptions.relative,
  transformOutputPath,
} = defaultOptions) => ({
  pluginName,
  options(conf) {
    console.debug('@@@@@@ INSIDE PLUGIN options.input @@@@@@@', conf.input);
    const normalizedGlobs = [conf.input].flat().map(input => input.replace(/\\/g, '/'));
    console.debug('normalizedGlobs', normalizedGlobs)
    // flat to enable input to be a string or an array
    // separate globs inputs string from others to enable input to be a mixed array too
    console.debug('[]', [path.normalize(conf.input.replace(/\\/g, '/'))]);
    console.debug('flat', [conf.input].flat()[0]);
    console.debug('partitions', partition([conf.input].flat(), isString));
    const [globs, others] = partition(normalizedGlobs, isString);
    console.debug('globs', globs.map(glob => path.normalize(glob))); // .replace(/\\\\/g, '\\')));
    console.debug('others', others);
    // get files from the globs strings and return as a Rollup entries Object
    const input = Object
      .assign(
        {},
        Object.fromEntries(fastGlob
          .sync(globs, globOptions)
          .map((name) => {
            console.debug('name', name);
            const filePath = path.normalize(path.relative(relative, name));
            console.debug('???? filepath', filePath);
            const isRelative = !filePath.startsWith(`..${path.sep}`);
            const relativeFilePath = (isRelative
              ? filePath
              : path.relative(`.${path.sep}`, name));
            if (transformOutputPath) {
              return [outputFileName(transformOutputPath(relativeFilePath, name)), name];
            }
            console.debug('???? outputFileName', outputFileName(relativeFilePath));
            return [outputFileName(relativeFilePath), name];
          })),
        // add no globs input to the result
        ...others,
      );
      // return the new configuration with the glob input and the non string inputs
    
    console.debug('???? input ', input);
    return {
      ...conf,
      input,
    };
  },
});
