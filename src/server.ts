import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import "express-async-errors";
import { config } from "./config";
import routes from "./routes";

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = config.port || 3000;

app.use("/api", routes);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`servidor on na porta: ${PORT}`);
  });
}

export default app;
