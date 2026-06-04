import "dotenv/config";

import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors"

import { RegisterRoutes } from "./generated/routes.js";
import swaggerDocument from "./generated/swagger.json"

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

RegisterRoutes(app);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));