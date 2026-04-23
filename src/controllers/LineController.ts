import type { Request, Response } from "express";
import { LineService } from "../services/LineService.js";

export class LineController {

  lineService: LineService;

  constructor() {
    this.lineService = new LineService()
  } 

  async getPostsSummary(req: Request, res: Response) {
    const { trailSlug, lineSlug } = req.params;
    if (typeof (trailSlug) != "string") { return (res.status(400).json({ error: "O parâmetro 'trailSlug deve ser uma string!" })) }
    if (typeof (lineSlug) != "string") { return (res.status(400).json({ error: "O parâmetro 'lineSlug deve ser uma string!" })) }
    try {
      const lines = await this.lineService.getPostsSummary(trailSlug, lineSlug)
      res.json(lines)
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar lines" });
    }
  }

  async getPosts(req: Request, res: Response) {
    const { trailSlug, lineSlug } = req.params;
    if (typeof (trailSlug) != "string") { return (res.status(400).json({ error: "O parâmetro 'trailSlug deve ser uma string!" })) }
    if (typeof (lineSlug) != "string") { return (res.status(400).json({ error: "O parâmetro 'lineSlug deve ser uma string!" })) }
    try {
      const lines = await this.lineService.getPostsForLine(trailSlug, lineSlug)
      res.json(lines)
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar lines" });
    }
  }


} 
