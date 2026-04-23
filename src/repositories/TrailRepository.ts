import { prisma } from "../database/prisma.js";

export class TrailRepository {
  async findAllWithRelations() {
    return prisma.trail.findMany({
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
  }

  async findLinesByTrail(trailSlug:string) {
    return prisma.trail.findUnique({
      where: { slug: trailSlug },
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

    })
  }
}