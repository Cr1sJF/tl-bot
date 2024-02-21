import express from "express";
import path from "path";
import "dotenv/config";
import "reflect-metadata";

import loader from "./loaders";
import fileUpload from "express-fileupload";

const app = express();
const port = process.env.PORT || 3001;

// Configuración de EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

// Middleware para parsear datos del formulario
app.use(express.urlencoded({ extended: true }));

loader(app);
