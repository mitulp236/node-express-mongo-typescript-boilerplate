import { Router } from "express";
import InitialController from "../controller/InitialController";
const router = Router();

router.get( "/", InitialController.init );

export default router;