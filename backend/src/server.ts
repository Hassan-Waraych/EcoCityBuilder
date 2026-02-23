import "dotenv/config";
import express from "express";
import { ping } from "./db.ts";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ app: "EcoCity Builder API", health: "/health" });
});

app.get("/health", async (_req, res) => {
  const dbOk = await ping();
  res.status(dbOk ? 200 : 503).json({ ok: dbOk, db: dbOk });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Backend on http://localhost:${port}`));
