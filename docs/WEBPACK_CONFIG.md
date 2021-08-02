### STEPS

- npm i -D webpack webpack-cli webpack-dev-server
- npm i -D clean-webpack-plugin
- npm install -D  eslint-plugin-react@latest

```js script
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main/index.tsx',
  output: {
    path: path.join.apply(__dirname, 'public/js'),
    publicPatch: '/public.js',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  devServer: {
    contentBase: './public',
    writeToDisk: true,
    historyApiFallback: true
  },
  external: {
    react: 'React',
    'react-dom': 'ReactDom'
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```
- npm i D node-sass sass-loader css-loader style-loader ts-loader
- Add extension `scss` to resolve extensions array
- Add 
- Add config module sass

``` js script
{
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        options: {
          modules: true
        }
      },{
        loader: 'sass-loader'
      }]
    }]
  }
}
```
- Create file sass-module.d.ts
``` js script
declare module '*.scss' {
  const content: { [className: string]: string }
  export = content
}
```
## Configure webpack with Jest

- npm i -D identity-obj-proxy
``` js script
module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '**/*.d.ts'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  transform: {
    '.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '\\.scss$': 'identity-obj-proxy'
  }
}
```