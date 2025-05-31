// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
const { CracoAliasPlugin } = require('react-app-alias');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: {
    optimization: {
      usedExports: process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'development',
    },
    plugins: process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'development' ? [
      new CompressionPlugin({ algorithm: 'gzip' }),
      new HtmlCriticalWebpackPlugin({
        base: path.resolve(__dirname, 'build'),
        src: 'index.html',
        dest: 'index.html',
        inline: true,
        minify: true,
        extract: true,
        width: 320,
        height: 565,
        penthouse: {
          blockJSRequests: false,
        },
      }),
    ] : [],
    // configure: (webpackConfig, { env, paths }) => {
    //   try {
    //     webpackConfig.optimization.splitChunks = {
    //       chunks: 'all',
    //       maxInitialRequests: 25,
    //       maxAsyncRequests: 30,
    //       cacheGroups: {
    //         // React core
    //         rfReactCoreVendors: {
    //           test: /[\\/]node_modules[\\/](react|react-dom|@reduxjs\/toolkit|redux|react-redux|react-scripts|react-router-dom|react-router-redux)/,
    //           name: "react-core-vendors",
    //           chunks: "all",
    //           priority: 50,
    //           reuseExistingChunk: true,
    //         },
    //         // Remaining vendors
    //         rfRemainingVendors: {
    //           test: /[\\/]node_modules[\\/]/,
    //           name: "remaining-vendors",
    //           chunks: "all",
    //           priority: 10,
    //           enforce: true,
    //           reuseExistingChunk: true,
    //         },

    //         // Disable default cache groups
    //         defaultVendors: false,
    //         default: false,
    //       },
    //     };
    //     return webpackConfig;
    //   } catch (error) {
    //     console.error("Error in CRACO webpack configuration: ", error);
    //     // Return the original config if there's an error
    //     return webpackConfig;
    //   }
    // },
  },
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: {
        source: 'options',
        aliases: {
          '@assets': 'src/assets',
          '@app': 'src/app',
          '@config': 'src/app/config',
          '@components': 'src/app/components',
          '@reducers': 'src/app/reducers',
          '@services': 'src/app/services',
          '@shared': 'src/app/shared',
          '@locale': 'src/locale',
          '@root': '.',
        },
      },
    },
  ],
};
