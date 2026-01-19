import express from "express";
import { routes } from "./routes";


const app = express();
app.use(express.json());
app.set('trust proxy', true);
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/", routes)



const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
export default app;
