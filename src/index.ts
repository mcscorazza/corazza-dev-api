import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();

app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        line: {
          include: { trail: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

app.get("/api/trails/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const trail = await prisma.trail.findUnique({
      where: { slug },
      include: {
        lines: {
          orderBy: { order: "asc" },
          include: {
            posts: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                slug: true,
                order: true,
              },
            },
          },
        },
      },
    });

    if (!trail) {
      return res.status(404).json({ error: "Trilha não encontrada no banco." });
    }

    res.json(trail);
  } catch (error) {
    console.error("❌ Erro ao buscar detalhes da trilha:", error);
    res.status(500).json({ error: "Erro interno ao processar a trilha." });
  }
});

app.get("/api/lines/:trailSlug/:lineSlug", async (req, res) => {
  const { trailSlug, lineSlug } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        line: {
          slug: lineSlug,
          trail: {
            slug: trailSlug,
          },
        },
      },
      orderBy: { order: "asc" },
      select: { title: true, slug: true, order: true },
    });
    res.json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar posts da linha específica." });
  }
});

app.get("/api/trails", async (req, res) => {
  try {
    const trails = await prisma.trail.findMany({
      orderBy: { order: "asc" },
      include: {
        lines: {
          orderBy: { order: "asc" },
          include: {
            _count: {
              select: { posts: true },
            },
            posts: {
              orderBy: { order: "asc" },
              take: 1,
              select: { slug: true },
            },
          },
        },
      },
    });

    const summary = trails.map((t) => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      lines: t.lines.map((l) => ({
        title: l.title,
        slug: l.slug,
        firstPostSlug: l.posts[0]?.slug,
      })),
      linesCount: t.lines.length,
      postsCount: t.lines.reduce((acc, l) => acc + l._count.posts, 0),
    }));

    res.json(summary);
  } catch (error) {
    console.error("❌ Erro ao buscar resumo das trilhas:", error);
    res.status(500).json({ error: "Erro ao carregar menu lateral" });
  }
});

app.get("/api/trails/:trailSlug/lines/:lineSlug", async (req, res) => {
  const { trailSlug, lineSlug } = req.params;

  const posts = await prisma.post.findMany({
    where: {
      line: {
        slug: lineSlug,
        trail: { slug: trailSlug },
      },
    },
    orderBy: { order: "asc" },
  });
  res.json(posts);
});

app.get("/api/posts/:trailSlug/:lineSlug/:postSlug", async (req, res) => {
  const { trailSlug, lineSlug, postSlug } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      slug_lineId: {
        slug: postSlug,
        lineId:
          (
            await prisma.line.findFirst({
              where: { slug: lineSlug, trail: { slug: trailSlug } },
            })
          )?.id || "",
      },
    },
    include: {
      line: { include: { trail: true } },
    },
  });

  if (!post) return res.status(404).json({ error: "Post não encontrado" });
  res.json(post);
});

app.post("/api/posts", async (req, res) => {
  const { slug, title, content, hash, summary, order, trail, line } = req.body;

  try {
    const trailDoc = await prisma.trail.upsert({
      where: { slug: trail.slug },
      update: { title: trail.title },
      create: {
        slug: trail.slug,
        title: trail.title,
        order: trail.order,
      },
    });

    const lineDoc = await prisma.line.upsert({
      where: {
        slug_trailId: {
          slug: line.slug,
          trailId: trailDoc.id,
        },
      },
      update: { order: line.order },
      create: {
        slug: line.slug,
        title: line.title,
        order: line.order,
        trailId: trailDoc.id,
      },
    });

    const postDoc = await prisma.post.upsert({
      where: {
        slug_lineId: {
          slug: slug,
          lineId: lineDoc.id,
        },
      },
      update: {
        title,
        content,
        hash,
        summary,
        order,
        lineId: lineDoc.id,
      },
      create: {
        slug,
        title,
        content,
        summary,
        hash,
        order,
        lineId: lineDoc.id,
      },
    });

    res.json(postDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Falha na sincronização relacional." });
  }
});

prisma
  .$connect()
  .then(() =>
    console.log("🐘 Conexão com o PostgreSQL estabelecida com sucesso!"),
  )
  .catch((err) => console.error("❌ Falha ao conectar no banco:", err));

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API rodando em http://0.0.0.0:${PORT}`);
});
