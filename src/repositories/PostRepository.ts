import { prisma } from "../database/prisma.js";

export class PostRepository {
  async findAll() {
    return prisma.post.findMany({
      include: {
        line: {
          include: { trail: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findSpecific(trailSlug: string, lineSlug: string, postSlug: string) {
    const line = await prisma.line.findFirst({
      where: { slug: lineSlug, trail: { slug: trailSlug } },
    });

    if (!line) return null;

    return prisma.post.findUnique({
      where: {
        slug_lineId: { slug: postSlug, lineId: line.id },
      },
      include: {
        line: { include: { trail: true } },
      },
    });
  }

  async upsertPostWithRelations(data: any) {
    const {
      slug,
      title,
      content,
      hash,
      summary,
      coverImage,
      tags,
      order,
      trail,
      line,
      color,
    } = data;

    const trailDoc = await prisma.trail.upsert({
      where: { slug: trail.slug },
      update: { title: trail.title },
      create: { slug: trail.slug, title: trail.title, order: trail.order },
    });

    const lineDoc = await prisma.line.upsert({
      where: {
        slug_trailId: { slug: line.slug, trailId: trailDoc.id },
      },
      update: { order: line.order },
      create: {
        slug: line.slug,
        title: line.title,
        order: line.order,
        color,
        trailId: trailDoc.id,
      },
    });

    return prisma.post.upsert({
      where: {
        slug_lineId: { slug: slug, lineId: lineDoc.id },
      },
      update: {
        title,
        content,
        hash,
        summary,
        coverImage,
        tags,
        order,
        lineId: lineDoc.id,
      },
      create: {
        slug,
        title,
        content,
        hash,
        summary,
        coverImage,
        tags,
        order,
        lineId: lineDoc.id,
      },
    });
  }
}
