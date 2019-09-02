const path = require('path');
const babel = require('rollup-plugin-babel');
const localResolve = require('rollup-plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');
const tsxControlStatements = require('tsx-control-statements').default;

const pkg = require(path.resolve('./package.json'));
const external = Object.keys(pkg.dependencies || {})
  .concat(Object.keys(pkg.peerDependencies || {}));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/es/stylr.js`,
      format: 'es',
    },
    {
      file: `dist/cjs/stylr.js`,
      format: 'cjs',
    },
  ],
  plugins: [
    localResolve(),
    typescript({
      tsconfig: path.resolve('./tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: {
          module: 'ES2015',
        },
      },
      transformers: [
        () => ({
          before:  [ tsxControlStatements() ],
          after: [],
        }),
      ],
    }),
    babel({
      exclude: 'node_modules/**',
      extensions: [ '.js', '.ts', '.tsx' ],
    }),
  ],
  external,
  onwarn: (warning, warn) => {
    if (warning.code === 'UNRESOLVED_IMPORT') {
      throw new Error(warning.message);
    }
    
    warn(warning);
  },
};
