import { Router } from "express";
import { LineController } from "../controllers/LineController.js";

const lineRoutes = Router();
const lineControler = new LineController();

lineRoutes.get(
    "/:trailSlug/:lineSlug" , 
    (req, res) => (lineControler.getPostsSummary(req, res))
);

export { lineRoutes }