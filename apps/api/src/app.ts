import express, {json, urlencoded} from "express";
import { RegisterRoutes } from "./generated/routes.js";
import swaggerUi from "swagger-ui-express";

export const app = express();

app.use(
    urlencoded({
        extended: true,
    })
);
app.use(json());

RegisterRoutes(app);