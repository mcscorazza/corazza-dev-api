import { prisma } from "../database/prisma.js";

export class LineRepository {
  async findPostsByLine(trailSlug: string, lineSlug:string) {
    return prisma.line.findMany({
      where: {
        slug: lineSlug,
        trail: {
          slug: trailSlug
        }
      },
      orderBy: { order: "asc" },
    });
  }

async findPostsSummaryByLine(trailSlug: string, lineSlug: string) {
    return prisma.post.findMany({
      where: {
        line: { slug: lineSlug, trail: { slug: trailSlug } },
      },
      orderBy: { order: "asc" },
      select: { title: true, slug: true, order: true },
    });
  }
}