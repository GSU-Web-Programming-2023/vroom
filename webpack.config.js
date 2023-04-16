const path = require('path');
const ThreeGltfLoader = require('three-gltf-loader');

module.exports = {
  entry: './static/javascript/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static/javascript'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(glb|gltf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '../bundled/models/',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: '../bundled/images/',
            },
          },
        ],
      },
      {
        test: /\.glsl$/,
        use: 'raw-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.glb', '.gltf', '.png', '.jpg', '.gif', '.glsl'],
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.beforeCompile.tap('BeforeCompilePlugin', () => {
          new ThreeGltfLoader();
        });
      },
    },
  ],
};
