import { Router } from "express";
import AuthController from "../controller/AuthController";
import InitialController from "../controller/InitialController";
import LoginDto from "../dto/Login.dto";
import validationMiddleware from "../middlewares/validater";
const router = Router();

router.post( "/login", validationMiddleware(LoginDto), AuthController.login );

export default router;