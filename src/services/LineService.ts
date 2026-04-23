import { LineRepository } from "../repositories/LineRepository.js";

export class LineService {
    private lineRepository: LineRepository;

    constructor() {
        this.lineRepository = new LineRepository()
    }

    async getPostsForLine(trailSlug:string, lineSlug:string) {
        return await this.lineRepository.findPostsByLine(trailSlug, lineSlug)
    }

    async getPostsSummary(trailSlug:string, lineSlug:string) {
        return await this.lineRepository.findPostsSummaryByLine(trailSlug, lineSlug)
    }
}