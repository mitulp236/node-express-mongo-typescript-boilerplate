import { Router } from "express";
import { Role } from "../config/config";
import AuthController from "../controller/AuthController";
import InitialController from "../controller/InitialController";
import ChangePasswordDto from "../dto/Auth/ChangePassword.dto";
import ForgotPasswordDto from "../dto/Auth/ForgotPassword.dto";
import ForgotPasswordVerifyDto from "../dto/Auth/ForgotPasswordVerifyToken.dto";
import LoginDto from "../dto/Auth/Login.dto";
import { auth } from "../middlewares/auth";
import { checkRole } from "../middlewares/checkRole";
import validationMiddleware from "../middlewares/validater";
const router = Router();

/**
 * @swagger
 * /api/Auth/login:
 *  post:
 *      description: Login Api
 *      consumes: 
 *         - application/json
 *      parameters:
 *          - in: body
 *            name: email
 *            description: ...
 *            schema:
 *              type: object
 *              required:
 *                  - email
 *                  - password
 *              properties:
 *                  email:
 *                      type: string
 *                      example: mitulp236@gmail.com
 *                  password:
 *                      type: string
 *                      example: mitul@123
 *      responses:
 *          '200':
 *              description: Logged in successfully.
 *          '401':
 *              description: Wrong authentication provided
 *          '500':
 *              description: Internal server error
 *      
 *  
 *           
 */
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