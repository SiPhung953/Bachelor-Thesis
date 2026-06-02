import "dotenv/config";

import express from "express";
import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "./generated/routes.js";
import swaggerDocument from "./generated/swagger.json"


export const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

RegisterRoutes(app);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));