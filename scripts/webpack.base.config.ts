/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackTemplate from 'html-webpack-template'
import { EnvironmentPlugin } from 'webpack'
import type { Configuration } from 'webpack'

import { resolvePath } from './utils'
import { config } from './config'
import { getGitVersion } from './gitInfo'

const baseWebpackConfig: Configuration = {
  mode: process.env.NODE_ENV as any,
  entry: resolvePath('src/index.tsx'),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'images/[name].[chunkhash:7].[ext]',
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
    ],
  },
  plugins: [
    // @see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      // inject: true,
      template: HtmlWebpackTemplate,
      ...config.templateConfig,
    } as any),
    // use `process.env.NODE_ENV`
    new EnvironmentPlugin({
      // NODE_ENV: process.env.NODE_ENV,
      PROJECT_NAME: process.env.npm_package_name,
      BUILD_DATE: new Date().toISOString(),
      CI: process.env.CI || null,
      VERSION: getGitVersion(),
      COVERAGE: (process.env.CI && 'coverage/lcov-report/index.html') || null,
      REPORT: (process.env.CI && 'report.html') || null,
    }),
  ],
}

export default baseWebpackConfig
