import express from "express";
import "dotenv/config";
import "reflect-metadata";
import loader from "./loaders";

const app = express();

loader(app);
