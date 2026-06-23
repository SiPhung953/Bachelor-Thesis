import "dotenv/config";

import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors"
import path from 'path';

import { RegisterRoutes } from "./generated/routes.js";
import swaggerDocument from "./generated/swagger.json"

export const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);

RegisterRoutes(app);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));