import webpack from "webpack";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import TerserPlugin from "terser-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const __dirname = dirname(fileURLToPath(import.meta.url));

const dirApp = join(__dirname, "app");
const dirAssets = join(__dirname, "assets");
const dirShared = join(__dirname, "shared");
const dirStyles = join(__dirname, "styles");
const dirNode = "node_modules";

const entry = [join(dirApp, "index.js"), join(dirStyles, "index.css")];

const resolve = {
  modules: [dirApp, dirAssets, dirShared, dirStyles, dirNode],
};

const plugins = [
  new webpack.DefinePlugin({
    IS_DEVELOPMENT,
  }),

  new CopyWebpackPlugin({
    patterns: [
      {
        from: "./shared",
        to: "",
      },
    ],
  }),

  new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[id].css",
  }),

  new ImageMinimizerPlugin({
    minimizer: {
      implementation: ImageMinimizerPlugin.imageminMinify,
      options: {
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 8 }],
        ],
      },
    },
  }),

  new CleanWebpackPlugin(),
];

const module = {
  rules: [
    {
      test: /\.(js)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
      },
      resolve: {
        fullySpecified: false,
      },
    },

    {
      test: /\.css$/,
      use: [
        // {
        //   loader: IS_DEVELOPMENT ? "style-loader" : MiniCssExtractPlugin.loader,
        // },
        {
          loader: "style-loader",
        },
        {
          loader: "css-loader",
        },
        {
          loader: "postcss-loader",
          ident: "postcss",
          options: {
            postcssOptions: {
              plugins: ["@tailwindcss/postcss"],
            },
          },
        },
      ],
    },

    {
      test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
      type: "asset/resource",
    },
    {
      test: /\.(jpe?g|png|gif|svg|webp)$/i,
      use: [
        {
          loader: ImageMinimizerPlugin.loader,
        },
      ],
    },

    {
      test: /\.(glsl|frag|vert)$/,
      loader: "raw-loader",
      exclude: /node_modules/,
    },

    {
      test: /\.(glsl|frag|vert)$/,
      loader: "glslify-loader",
      exclude: /node_modules/,
    },
  ],
};

const optimization = {
  minimize: true,
  minimizer: [new TerserPlugin()],
};

const config = {
  entry,
  resolve,
  plugins,
  module,
  optimization,
};

export default config;
