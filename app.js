import env from "dotenv";

import express from "express";
import logger from "morgan";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import errorHandler from "errorhandler";
import { UAParser } from "ua-parser-js";
import { engine } from "express-handlebars";

env.config();
const port = 3300;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(logger("dev"));
app.use(errorHandler());
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));

app.use((req, res, next) => {
  const ua = UAParser(req.headers["user-agent"]);

  const device = ua.device.type === undefined ? "desktop" : ua.device.type;
  res.locals.device = device;

  next();
});

app.engine("handlebars", engine());
app.set("views", join(__dirname, "views"));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("pages/home", {
    name: "home",
  });
});

app.listen(port, () => {
  console.log("server started on " + port);
});
