import { Request, Response } from "express";
import * as i18n from "i18n"
import { AnyArray } from "mongoose";
import config, { Role } from "../config/config";
import CreateUserDto from "../dto/User/CreateUser.dto";
import LoginDto from "../dto/Auth/Login.dto";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import UserModel from "../model/User/user.model";
import AuthService from "../services/AuthService";
import CommonService from "../services/CommonService";
import UserService from "../services/UserService";

class UserController {

    private user = UserModel;
    private userService = UserService;
    private authService = AuthService;

    register = async ( req: Request, res: Response ) => {
        try {
            const reqBody: CreateUserDto = req.body;
            const {email, password, mobile } = reqBody;
            let orQuery: any = [{ email: email.toLowerCase() }];
            if (mobile && mobile != '') {
                orQuery.push({ mobile: mobile });
            }
            let filter = { $or: orQuery };
            const user = await this.user.findOne(filter);
             //if user exist give error
            if (user && (user.email || user.mobile)) {
                if (user.email && user.email == email) {
                    return res.send({ status: 0, message: i18n.__('DUPLICATE_EMAIL_ID') });
                }
                if (user.mobile && mobile != '' && user.mobile == mobile) {
                    return res.send({ status: 0, message: i18n.__('DUPLICATE_MOBILE') });
                }
            }

            /** Validate and Encrypt password **/
            let isPasswordValid = await this.authService.validatePassword({ userObj: user, password: password,  });
            if (isPasswordValid && !isPasswordValid.status) {
                return res.status(403).send(isPasswordValid);
            }
            let encryptedPassword = await this.authService.encryptPassword(password);

            const savedUser = await new this.user({
                ...reqBody,
                password: encryptedPassword,
                passwordUpdatedAt: new Date(),
                previouslyUsedPasswords: [encryptedPassword],
                role: Role.USER
            }).save();

            /** send varification email **/

            return res.send({ status: 1, message: i18n.__('REGISTRATION_SUCCESS'), data: { _id: savedUser._id }, statusCode: 200 });
           
        } catch (error) {
            console.log('error register- ', error);
            let errorMessage = await CommonService.errorHandler(error);
            return res.send({ status: 0, message: errorMessage ? errorMessage : error, statusCode: 500 });
        } 
    }
}
export default new UserController();