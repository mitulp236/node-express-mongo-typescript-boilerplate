import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as i18n from "i18n"
import LoginDto from "../dto/Login.dto";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import User from "../model/User/user.interface";
import UserModel from "../model/User/user.model";
import AuthService from "../services/AuthService";
import CommonService from "../services/CommonService";
import UserService from "../services/UserService";

class AuthController {

    private user = UserModel;
    private userService = UserService;
    private authService = AuthService;

    login = async ( req: Request, res: Response ) => {
        try {
            let { email, password } : LoginDto = req.body;
            email = email.toLowerCase();
            let user = await this.userService.getUserByEmailId( email );
            if(!user){
                return res.status( 406 ).send( new WrongCredentialsException() );
            }
            const valid_password = await bcrypt.compare(
                password,
                user.password,
            );
            if ( !valid_password ){
				return res.status( 406 ).send( new WrongCredentialsException() );
			}
            const updatedUser: User = await this.authService.getUpdatedUserWithTokens(user._id);
            return res.send({ status: 1, message: i18n.__('LOGIN_SUCCESS'), access_token: updatedUser.token, data: updatedUser, statusCode: 200 });

        } catch (error) {
            console.log('error register- ', error);
            let errorMessage = await CommonService.errorHandler(error);
            return res.send({ status: 0, message: errorMessage ? errorMessage : error, statusCode: 500 });
        }  
    }
}
export default new AuthController();