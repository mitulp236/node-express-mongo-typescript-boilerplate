import { Router } from "express";
import UserController from "../controller/UserController";
import CreateUserDto from "../dto/User/CreateUser.dto";
import validationMiddleware from "../middlewares/validater";
const router = Router();

router.post( "/", validationMiddleware(CreateUserDto), UserController.register );

export default router;