import type { Request, Response } from "express";
import { TrailService } from "../services/TrailService.js";

export class TrailController {
  private trailService: TrailService;

  constructor() {
    this.trailService = new TrailService();
  }

  async index(req: Request, res: Response) {
    try {
      const summary = await this.trailService.getTrailsSummary();
      res.json(summary);
    } catch (error) {
      console.error("❌ Erro ao buscar resumo das trilhas:", error);
      res.status(500).json({ error: "Erro ao carregar menu lateral" });
    }
  }

  async show(req: Request, res: Response) {
    const { trailSlug, lineSlug } = req.params;
    if (typeof (trailSlug) != "string") { return (res.status(400).json({ error: "O parâmetro 'trailSlug deve ser uma string!" })) }
    try {
      const posts = await this.trailService.getTrailLines(trailSlug);
      res.json(posts)
    } catch (error) {
      console.error("❌ Erro ao buscar posts:", error);
      res.status(500).json({ error: "Erro ao carregar posts" });
    }
  }

}