import { Router } from "express";
import { PostController } from "../controllers/PostController.js";

const postRoutes = Router();
const postController = new PostController();

postRoutes.get("/", (req, res) => postController.index(req, res));
postRoutes.get("/:trailSlug/:lineSlug/:postSlug", (req, res) => postController.show(req, res));
postRoutes.post("/", (req, res) => postController.create(req, res));

export { postRoutes };