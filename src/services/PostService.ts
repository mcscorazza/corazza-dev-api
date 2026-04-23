import { PostRepository } from "../repositories/PostRepository.js";

export class PostService {
  private postRepository: PostRepository;

  constructor() {
    this.postRepository = new PostRepository();
  }

  async getAllPosts() {
    return await this.postRepository.findAll();
  }

  async getSpecificPost(trailSlug: string, lineSlug: string, postSlug: string) {
    const post = await this.postRepository.findSpecific(trailSlug, lineSlug, postSlug);
    if (!post) {
      throw new Error("Post não encontrado");
    }
    return post;
  }

  async syncPost(data: any) {
    return await this.postRepository.upsertPostWithRelations(data);
  }
}