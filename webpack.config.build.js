import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { merge } from "webpack-merge";
import config from "./webpack.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default merge(config, {
  mode: "production",

  output: {
    path: join(__dirname, "public"),
  },
});
