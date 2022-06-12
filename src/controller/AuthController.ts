import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as i18n from "i18n"
import LoginDto from "../dto/Auth/Login.dto";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import User from "../model/User/user.interface";
import UserModel from "../model/User/user.model";
import AuthService from "../services/AuthService";
import CommonService from "../services/CommonService";
import UserService from "../services/UserService";
import ForgotPasswordDto from "../dto/Auth/ForgotPassword.dto";
import config from "../config/config";
import ForgotPasswordVerifyDto from "../dto/Auth/ForgotPasswordVerifyToken.dto";
import RequestWithUser from "../interfaces/RequestWithUser";
import ChangePasswordDto from "../dto/Auth/ChangePassword.dto";

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
            const valid_password = bcrypt.compareSync(
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

    forgotPassword = async ( req: Request, res: Response ) => {
		try
		{
			const forgotPasswordPayload: ForgotPasswordDto = req.body;
			const user = await this.userService.getUserByEmailId( forgotPasswordPayload.email );
			if ( !user )
			{
				return res.status(404).send({ status: 0, error: "User not found"})
			}
            const token = await this.authService.generateForgotToken(user._id);
            if(!token || token.status === 0) {
                return res.status( 403 ).send( { status: 0, error: "Error in forgot password token generation"} );
            }

            user.forgotToken = token.data;
            user.forgotTokenCreationTime = new Date( new Date().getTime() + parseInt('3600000'));
            await user.save();

            const link = `${process.env.FRONT_END_BASE_URL}/pages/new-password/${user.forgotToken}`;
            console.log("ForgotPasswordLink: ", link)
            // setup email logic
            // new ForgotPasswordEmail( link, user );

            return res
                .status( 200 )
                .send( { status: 200, message: "Reset link is sent to you email" } );
		} catch ( exception )
		{
			res.status( 500 ).send( {
				error: exception,
			} );
		}
	};

    forgotPasswordVarifyToken = async ( req: Request, res: Response ) => {
		try
		{
			const { token, newPassword }: ForgotPasswordVerifyDto = req.body;
            
			const user = await this.userService.getSingleUserByQuery({
                            forgotToken: token, forgotTokenCreationTime: { $gt: new Date( new Date().getTime() ) },
			            });
            if (!user) {
                return res
                    .status( 403 )
                    .send( { status: 403, message: "session expired, try again" } );
            }

             /** Validate and Encrypt password **/
             let isPasswordValid = await this.authService.validatePassword({ userObj: user, password: newPassword,  });
             if (isPasswordValid && !isPasswordValid.status) {
                 return res.status(403).send(isPasswordValid);
             }
             let encryptedPassword = await this.authService.encryptPassword(newPassword);

             user.password = encryptedPassword;
             user.passwordUpdatedAt = new Date();
             user.previouslyUsedPasswords = [...user.previouslyUsedPasswords,encryptedPassword];
             user.forgotToken = null;
             user.forgotTokenCreationTime = null;
             const savedUser = await user.save();
             res.status( 200 ).send( {
                status: 200,
                message: "password changed successfully",
            } );
		} catch ( exception )
		{
			res.status( 500 ).send( {
				error: exception,
			} );
		}
	};

    changePassword = async ( req: RequestWithUser, res: Response ) => {
		try
		{
			const { oldPassword, newPassword }: ChangePasswordDto = req.body;
			const user = await this.userService.getUserById( req.user._id );
            
            if(!user){
                return res.status(404).send({status: 0, error: i18n.__("USER_NOT_EXIST") })
            }

			const valid_password = bcrypt.compareSync(
                oldPassword,
                user.password,
            );
			if ( !valid_password )
			{
				return res
					.status( 403 )
					.send( { status: 403, error: "Invalid old pasword" } );
			}

            /** Validate and Encrypt password **/
            let isPasswordValid = await this.authService.validatePassword({ userObj: user,password: newPassword,  });
            if (isPasswordValid && !isPasswordValid.status) {
                return res.status(403).send(isPasswordValid);
            }
            let encryptedPassword = await this.authService.encryptPassword(newPassword);

            user.password = encryptedPassword;
            user.passwordUpdatedAt = new Date();
            user.previouslyUsedPasswords.push(encryptedPassword);
			const savedUser = await user.save();
			return res.status( 200 )
				.send( { status: 200, message: "Password changed successfully." } );
		} catch ( exception )
		{
			res.status( 500 ).send( {
				error: exception,
			} );
		}
	};
}
export default new AuthController();