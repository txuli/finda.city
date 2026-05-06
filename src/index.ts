import express from "express";
import { routes } from "./routes";


import rateLimiter from "./middlewares/ratelimit";
import { log } from "discord-logify";
const app = express();
app.use(express.json());
app.use(rateLimiter)
app.set('trust proxy', true);
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/", routes)


const logger= new log()
const port = Number(process.env.PORT ?? 3005);
app.listen(port, () => logger.Info(`API running on http://localhost:${port}`));
export default app;
