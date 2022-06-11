import { Router } from "express";
import { Role } from "../config/config";
import AuthController from "../controller/AuthController";
import InitialController from "../controller/InitialController";
import ChangePasswordDto from "../dto/ChangePassword.dto";
import ForgotPasswordDto from "../dto/ForgotPassword.dto";
import ForgotPasswordVerifyDto from "../dto/ForgotPasswordVerifyToken.dto";
import LoginDto from "../dto/Login.dto";
import { auth } from "../middlewares/auth";
import { checkRole } from "../middlewares/checkRole";
import validationMiddleware from "../middlewares/validater";
const router = Router();

router.post( "/login", validationMiddleware(LoginDto), AuthController.login );
router.post( "/forgotPassword", validationMiddleware(ForgotPasswordDto), AuthController.forgotPassword );
router.post( "/setNewPassword", validationMiddleware(ForgotPasswordVerifyDto), AuthController.forgotPasswordVarifyToken );
router.post( "/changePassword", [
    auth,
    checkRole([
        Role.SUPER_ADMIN.toString(),
        Role.ADMIN.toString(),
        Role.USER.toString(),
    ]),
],
validationMiddleware(ChangePasswordDto), AuthController.changePassword );

export default router;