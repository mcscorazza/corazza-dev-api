import type { Request, Response } from "express";
import { PostService } from "../services/PostService.js";

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  async index(req: Request, res: Response) {
    try {
      const posts = await this.postService.getAllPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar posts" });
    }
  }

  async show(req: Request, res: Response) {
    const { trailSlug, lineSlug, postSlug } = req.params;
    if (typeof (trailSlug) != "string") { return (res.status(400).json({ error: "O parâmetro 'trailSlug deve ser uma string!" })) }
    if (typeof (lineSlug) != "string") { return (res.status(400).json({ error: "O parâmetro 'lineSlug deve ser uma string!" })) }
    if (typeof (postSlug) != "string") { return (res.status(400).json({ error: "O parâmetro 'postSlug deve ser uma string!" })) }
    try {
      const post = await this.postService.getSpecificPost(trailSlug, lineSlug, postSlug);
      res.json(post);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const postDoc = await this.postService.syncPost(req.body);
      res.json(postDoc);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Falha na sincronização relacional." });
    }
  }
}