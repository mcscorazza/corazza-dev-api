import { Router } from "express";
import { postRoutes } from "./post.routes.js";
import { trailRoutes } from "./trail.routes.js";
import { lineRoutes } from "./line.routes.js";

const router = Router();

router.use("/posts", postRoutes);
router.use("/trails", trailRoutes);
router.use("/lines", lineRoutes);

export { router };