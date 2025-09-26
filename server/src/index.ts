import { group } from "console";
import express from "express";
import type { Request, Response } from "express";

import groupRoute from "./routes/group.route";
import noteRoute from "./routes/notes.route";
import doubtsRoute from "./routes/doubts.route";
import decksRoute from "./routes/flashcard.route";

import { AuthRoute } from "./routes/AuthRouter.js";

import { ConnectDb } from "./config/dbconn.js";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import { UserRoute } from "./routes/UsersRoute";

const app = express();
const PORT = 3000;

dotenv.config();

app.use(cookieParser());

app.use(express.json());
app.use("/api/groups", groupRoute);
app.use("/api/decks", decksRoute);

app.use("/api/auth", AuthRoute);

app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);

ConnectDb();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express + TypeScript!");
});

app.use("/api/notes", noteRoute);
app.use("/api/doubts", doubtsRoute);

app.listen(PORT, () => {
  ConnectDb();
  console.log(`Server is running at http://localhost:${PORT}`);
});
