import express from "express";
import { routes } from "./routes";
import {client} from "./config/db"

import rateLimiter from "./middlewares/ratelimit";
const app = express();
app.use(express.json());
app.use(rateLimiter)
app.set('trust proxy', true);
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/", routes)



const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
export default app;
