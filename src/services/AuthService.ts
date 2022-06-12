import config from "../config/config";
import * as jwt from "jsonwebtoken";
import * as _ from "lodash"
import * as bcrypt from "bcrypt";
import * as moment from "moment"
import UserModel from "../model/User/user.model";
import * as i18n from "i18n"
import * as commonlyUsedPassword from "../config/commonlyUsedPassword.json"

class AuthService {

    private user = UserModel;

    authentication = async ( email: string, password: string ) => {
		const encryptedPassword = await this.encryptPassword(password);
        const user = await this.user.findOne({ email: email, password: encryptedPassword, isDeleted: false });
        console.log("user: ", user)
        return user;
    }

    generateToken( _id: string ): Promise<any> {
		return new Promise(async (resolve, reject) => {
            try {
                const data = jwt.sign({
                    _id,
                    algorithm: config.tokenAlgorithm,
                    exp: Math.floor(Date.now() / 1000) + parseInt(config.tokenExpirationTime)
                }, config.jwtSecret);
                return resolve({ status: 1, data });
            } catch (error) {
                console.error('error In ====>>>> generateToken <<<<====', error);
                return reject({ status: 0, error });
            }
        });
	}

    generateForgotToken( _id: string ): Promise<any> {
		return new Promise(async (resolve, reject) => {
            try {
                const data = jwt.sign({
                    _id,
                    algorithm: config.tokenAlgorithm,
                    exp: Math.floor(Date.now() / 1000) + parseInt(config.tokenExpirationTime)
                }, config.resetPasswordSecret);
                return resolve({ status: 1, data });
            } catch (error) {
                console.error('error In ====>>>> generateForgotToken <<<<====', error);
                return reject({ status: 0, error });
            }
        });
	}

    generateRefreshToken( _id: string ): Promise<any> {
		return new Promise(async (resolve, reject) => {
            try {
                const data = jwt.sign({
                    _id,
                    algorithm: config.tokenAlgorithm,
                    exp: Math.floor(Date.now() / 1000) + parseInt(config.refreshTokenExpirationTime)
                }, config.jwtRefreshTokenSecret);
                return resolve({ status: 1, data });
            } catch (error) {
                console.error('error In ====>>>> generateToken <<<<====', error);
                return reject({ status: 0, error });
            }
        });
	}

	getTokenExpiryTime(): Promise<any> {
		return new Promise(async (resolve, reject) => {
            try {
               return  resolve({ status: 0, data: moment().add(parseInt(config.tokenExpirationTime), 'seconds')});
            } catch (error) {
                console.error('error In ====>>>> generateToken <<<<====', error);
                return reject({ status: 0, error });
            }
        });
	}

	getUpdatedUserWithTokens(_id: string): Promise<any> {
		return new Promise(async (resolve, reject) => { 
			try {
				const token = await this.generateToken( _id );
				const refreshToken = await this.generateRefreshToken( _id );
				const tokenExpiryTime = await this.getTokenExpiryTime();

				const updatedUser = await this.user.findByIdAndUpdate(_id, { token: token.data, refreshToken: refreshToken.data, tokenExpiryTime: tokenExpiryTime.data }, { new: true })

				return resolve(updatedUser)
			} catch (error) {
				resolve(error)
			}
			
		});
	}

	encryptPassword( password: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
            try {
                const salt = 10;
                if (password && password !== "") {
                    const encryptedPassword = bcrypt.hashSync( password, salt );
                    return resolve(encryptedPassword);
                }
                throw new Error('Password shound not be empty or blank')
            } catch (error) {
                reject(error);
            }
        });

	}

	validatePassword( data: any ): any {

        return new Promise(async (resolve, reject) => {
            try {
                if (data && data.password) {
                    if (data.firstName && _.isEqual(data.password, data.firstName)) {
                        resolve({ status: 0, error: i18n.__("PASSWORD_NOT_SAME_FIRSTNAME") });
                    }
                    // Check new password is already used or not
                    if (config.dontAllowPreviouslyUsedPassword && data.userObj && data.userObj.previouslyUsedPasswords && Array.isArray(data.userObj.previouslyUsedPasswords) && data.userObj.previouslyUsedPasswords.length) {
                        for (let i = 0; i < data.userObj.previouslyUsedPasswords.length; i++) {
                            const usedPassword = data.userObj.previouslyUsedPasswords[i];
                            const valid_password = bcrypt.compareSync(
                                data.password,
                                usedPassword,
                            );
                            if(valid_password){
                                resolve({ status: 0, error: i18n.__("ALREADY_USED_PASSWORD") });
                            }
                        }
                    }
                    if(commonlyUsedPassword && Array.isArray(commonlyUsedPassword["passwords"])) {
                        const isCommanPassword = commonlyUsedPassword["passwords"].includes(data.password)
                        if(isCommanPassword) {
                            resolve({ status: 0, error: i18n.__("COMMON_PASSWORD") });
                        }
                    }
                    
                    resolve({ status: 1, message: i18n.__("VALID_PASSWORD") })
                } else {
                    resolve({ status: 0, error:  i18n.__("PASSWORD_REQUIRED")  })
                }
            } catch (error) {
                reject({ status: 0, error:  i18n.__("PASSWORD_NOTVALID")  });
            }
        });

	}
}
export default new AuthService();