import express from "express";
import cors from "cors";
import { router } from "./routes/index.js";
import { prisma } from "./database/prisma.js";

const app = express();

app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

app.use("/api", router);

prisma
  .$connect()
  .then(() => console.log("📝 Conexão com DB estabelecida com sucesso!"))
  .catch((err: any) => console.error("❌ Falha ao conectar no banco:", err));

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API rodando em http://0.0.0.0:${PORT}`);
});
