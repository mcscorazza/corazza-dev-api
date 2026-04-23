import { TrailRepository } from "../repositories/TrailRepository.js";

export class TrailService {
  private trailRepository: TrailRepository;

  constructor() {
    this.trailRepository = new TrailRepository();
  }

  async getTrailsSummary() {
    const trails = await this.trailRepository.findAllWithRelations();

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
    return summary;
  }

  async getTrailLines(trailSlug: string) {
    const posts = await this.trailRepository.findLinesByTrail(trailSlug);
    return posts;
  }
}
