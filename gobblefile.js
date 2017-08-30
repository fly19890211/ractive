/*eslint-env node */
/*eslint object-shorthand: 0 quote-props: 0 */
const fs = require('fs')
const path = require('path')
const fsplus = require('fs-plus')
const gobble = require('gobble')
const rollup = require('rollup')

const unixPath = p => p.split(path.sep).join('/')
const packageName = p => p.split('/')[1]


module.exports = ({
  'dev'() {
    const packagePaths = fsplus.listSync('packages').map(unixPath)
    const packageNames = packagePaths.map(packageName)

    // Node each so that when that package changes, only that package rebuilds.
    const packageNodes = packagePaths.map(p => gobble(p))

    // TODO: For each node, build (lint, bundle, transpile)
    // By now, we should have a build of packages with dists

    const movedNodes = packageNodes.map((n, i) => n.moveTo(packageNames[i]))

    // TODO: Mix sandbox

    return gobble(movedNodes)
  },
  'test'() {
    // TODO: build
    // TODO: run tests each
  },
  'bundle'() {
    // TODO: build
  }
})[gobble.env()]()

////////////////////////////////////////////////////////////////////////////////


// const bundle = (inputDir, outputDir, options) => {
//   const packages = fsPlus.listSync(inputDir)
//   const libRoot = packages
//     .map(p => path.resolve(p, 'src/index.js'))
//     .map(p => buildLib(p))
//     .map(b => fsWritePromise())

//   console.log(libRoot)

//   return Promise.resolve()
// }

// const buildLib = (source, destination) => {
//   const code = ''
//   const map = ''
//   return { code, map }
// }

// /* Bundle builders */

// // Builds a UMD bundle of Ractive
// function buildUmdLib(dest, plugins = []) {
//   return src.transform(rollup, {
//     plugins: plugins,
//     moduleName: 'Ractive',
//     format: 'umd',
//     entry: 'Ractive.js',
//     dest: dest,
//     banner: banner,
//     noConflict: true,
//     cache: false,
//     sourceMap: true
//   }).transform(transpile, { accept: ['.js'] }).transform(replacePlaceholders)
// }

// // Builds an ES bundle of Ractive
// function buildESLib(dest, plugins = []) {
//   return src.transform(rollup, {
//     plugins: plugins,
//     format: 'es',
//     entry: 'Ractive.js',
//     dest: dest,
//     banner: banner,
//     cache: false,
//     sourceMap: true
//   }).transform(transpile, { accept: ['.js', '.mjs'] }).transform(replacePlaceholders)
// }

// // Builds a UMD bundle for browser/PhantomJS tests.
// function buildBrowserTests() {
//   return gobble([
//     browserTests,
//     browserTests.transform(buildTestEntryPoint, { dir: 'browser' })
//   ])
//     .transform(copy)
//     .transform(rollup, {
//       moduleName: 'RactiveBrowserTests',
//       format: 'iife',
//       entry: 'index.js',
//       dest: 'tests-browser.js',
//       globals: {
//         qunit: 'QUnit',
//         simulant: 'simulant'
//       },
//       external: ['qunit', 'simulant'],
//       cache: false,
//       sourceMap: true
//     })
// }

// // Builds a CJS bundle for node tests.
// function buildNodeTests() {
//   return gobble([
//     nodeTests,
//     nodeTests.transform(buildTestEntryPoint, { dir: 'node' })
//   ])
//     .transform(copy)
//     .transform(rollup, {
//       format: 'cjs',
//       entry: 'index.js',
//       dest: 'tests-node.js',
//       external: ['cheerio'],
//       cache: false,
//       sourceMap: true
//     })
// }

// function buildUmdPolyfill() {
//   return polyfills.transform(rollup, {
//     moduleName: 'RactivePolyfills',
//     format: 'umd',
//     entry: 'polyfills.js',
//     dest: 'polyfills.js',
//     cache: false,
//     sourceMap: true
//   }).transform(transpile, { accept: ['.js'] }).transform(replacePlaceholders)
// }

// function buildESPolyfill() {
//   return polyfills.transform(rollup, {
//     format: 'es',
//     entry: 'polyfills.js',
//     dest: 'polyfills.mjs',
//     cache: false
//   }).transform(transpile, { accept: ['.js'] }).transform(replacePlaceholders)
// }

// /* Rollup plugins */

// // Replaces a modules content with a null export to omit module contents.
// function skipModule(excludedModules) {
//   return {
//     name: 'skipModule',
//     transform: function (src, modulePath) {
//       const moduleRelativePath = path.relative(path.join(__dirname, 'src'), modulePath).split(path.sep).join('/')
//       const isModuleExcluded = excludedModules.indexOf(moduleRelativePath) > -1;

//       const source = new MagicString(src)
//       const sourceLength = src.length;

//       const transformCode = isModuleExcluded ? source.overwrite(0, sourceLength, 'export default null;') : source;
//       const transformMap = transformCode.generateMap({ hires: true })

//       return { code: transformCode.toString(), map: transformMap.toString() };
//     }
//   };
// }

// /* Gobble transforms */

// // Essentially gobble-buble but takes out the middleman.
// // eslint-disable-next-line no-unused-vars
// function transpile(src, options) {
//   return buble.transform(src, {
//     target: { ie: 9 },
//     transforms: { modules: false }
//   })
// }

// // Builds an entrypoint in the designated directory that imports all test specs
// // and calls them one after the other in tree-listing order.
// function buildTestEntryPoint(inDir, outDir, options) {
//   const _options = Object.assign({ dir: '' }, options)
//   const testPaths = fsPlus.listTreeSync(path.join(inDir, _options.dir)).filter(testPath => fsPlus.isFileSync(testPath) && path.extname(testPath) === '.js')
//   const testImports = testPaths.map((testPath, index) => `import test${index} from './${path.relative(inDir, testPath).replace(/\\/g, '/')}';`).join('\n')
//   const testCalls = testPaths.map((testPath, index) => `test${index}()`).join('\n')
//   fs.writeFileSync(path.join(outDir, 'index.js'), `${testImports}\n${testCalls}`, 'utf8')
//   return Promise.resolve()
// }

// // Looks for placeholders in the code and replaces them.
// // eslint-disable-next-line no-unused-vars
// function replacePlaceholders(src, options) {
//   return Object.keys(placeholders).reduce((out, placeholder) => {
//     return out.replace(new RegExp(`${placeholder}`, 'g'), placeholders[placeholder])
//   }, src)
// }

// // This is because Gobble's grab and Rollup's resolution is broken
// // https://github.com/gobblejs/gobble/issues/89
// // https://github.com/rollup/rollup/issues/1291
// function copy(inputdir, outputdir, options) {
//   const _options = Object.assign({ dir: '.' }, options)
//   fsPlus.copySync(path.join(inputdir, _options.dir), outputdir)
//   return Promise.resolve()
// }

// function rollup(indir, outdir, options) {
//   if (!options.entry) throw new Error('You must supply `options.entry`')

//   options.dest = path.resolve(outdir, options.dest || options.entry)
//   options.entry = path.resolve(indir, options.entry)

//   return rollupLib.rollup(options).then(bundle => bundle.write(options))
// }
