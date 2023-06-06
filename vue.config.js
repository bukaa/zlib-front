const path = require('path')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const zlib = require('zlib')
const packageJson = require('./package.json')
const buildDate = JSON.stringify(new Date().toLocaleString())
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// eslint-disable-next-line no-unused-vars
const isProd = process.env.NODE_ENV === 'production'
// eslint-disable-next-line no-unused-vars
const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.5.1/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js'
  ]
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin({
        contextRegExp: /^\.\/locale$/,
        resourceRegExp: /moment$/
      }),
      // 下面两项配置才是 compression-webpack-plugin 压缩配置
      // 压缩成 .gz 文件
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      // 压缩成 .br 文件，如果 zlib 报错无法解决，可以注释这段使用代码，一般本地没问题，需要注意线上服务器会可能发生找不到 zlib 的情况。
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11
          }
        },
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.DefinePlugin({
        APP_VERSION: `"${packageJson.version}"`,
        BUILD_DATE: buildDate
      })
    ],
    // 开启分离 js
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name (module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              names = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)
              if(!names || names.length < 1) {
                return
              }
              const packageName = names[1]
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    }
    // en_US: `if prod, add externals`
    // zh_CN: `这里是用来控制编译忽略外部依赖的，与 config.plugin('html') 配合可以编译时引入外部CDN文件依赖`
    // externals: isProd ? assetsCDN.externals : {}
  },

  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'))

    // fixed svg-loader by https://github.com/damianstasik/vue-svg-loader/issues/185#issuecomment-1126721069
		const svgRule = config.module.rule('svg')
		// Remove regular svg config from root rules list
		config.module.rules.delete('svg')

		config.module.rule('svg')
			// Use svg component rule
			.oneOf('svg_as_component')
				.resourceQuery(/inline/)
				.test(/\.(svg)(\?.*)?$/)
				.use('babel-loader')
					.loader('babel-loader')
					.end()
				.use('vue-svg-loader')
					.loader('vue-svg-loader')
					.options({
						svgo: {
							plugins: [
								{ prefixIds: true },
								{ cleanupIDs: true },
								{ convertShapeToPath: false },
								{ convertStyleToAttrs: true }
							]
						}
					})
					.end()
				.end()
			// Otherwise use original svg rule
			.oneOf('svg_as_regular')
				.merge(svgRule.toConfig())
				.end()

    // en_US: If prod is on assets require on cdn
    // zh_CN: 如果是 prod 模式，则引入 CDN 依赖文件，有需要减少包大小请自行解除依赖
    //
    // if (isProd) {
    //   config.plugin('html').tap(args => {
    //     args[0].cdn = assetsCDN
    //     return args
    //   })
    // }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          'border-radius-base': '2px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8000,
    // If you want to turn on the proxy, please remove the mockjs /src/main.js
    proxy: {
      '/book': {
        target: 'http://47.92.174.45:6789/',
        ws: false,
        changeOrigin: true
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
