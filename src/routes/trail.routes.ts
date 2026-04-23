import { Router } from "express";
import { TrailController } from "../controllers/TrailController.js";
import { LineController } from "../controllers/LineController.js";

const trailRoutes = Router();
const trailController = new TrailController();
const lineControler = new LineController();

trailRoutes.get("/", (req, res) => trailController.index(req, res))
trailRoutes.get("/:trailSlug", (req, res) => trailController.show(req, res))
trailRoutes.get("/:trailSlug/lines/:lineSlug", (req, res) => lineControler.getPosts(req, res))

export {trailRoutes}