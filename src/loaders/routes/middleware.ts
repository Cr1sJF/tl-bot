import express, { Application, Request, Response } from "express";
import Log from "../../models/Loggers/Logger";
import fileUpload from "express-fileupload";
import jwt from "jsonwebtoken";
// import formidabble from "express-formidable";
// import favicon from "serve-favicon";
import path from "path";

const log = new Log("Middleware");

export default async (app: Application) => {
  try {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
      }),
    );
    app.set("view engine", "ejs");

    // // Establecer la ubicación de las vistas (carpeta 'views' en este ejemplo)
    // app.set("views", path.join(process.cwd(), "\\src\\templates\\views"));

    // const assetsPath = path.join(__dirname, '../public/assets');

    // // Sirviendo archivos estáticos desde la carpeta de assets
    // app.use('/assets', express.static(assetsPath));

    // app.use(express.static(path.join(process.cwd(), "\\src\\templates\\public")));

    app.set("views", path.join(process.cwd(), "/src/templates/views"));

    const assetsPath = path.join(__dirname, "../../public/assets");

    // Sirviendo archivos estáticos desde la carpeta de assets
    app.use("/assets", express.static(assetsPath));

    app.use(express.static(path.join(process.cwd(), "/src/templates/public")));
  } catch (error: any) {
    log.error("Error creando Middleware", error);
  }
};
