import express from "express";
import "dotenv/config";
import "reflect-metadata";
import loader from "./loaders";
import fileUpload from "express-fileupload";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);


loader(app);
