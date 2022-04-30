import { dontAllowPreviouslyUsedPassword } from "../config/config";
import config from "../config/config";
import * as jwt from "jsonwebtoken";
import * as _ from "lodash"
import * as bcrypt from "bcrypt";
import * as moment from "moment"
import DataStoredInToken from "../interfaces/DataStoredInToken";
import TokenData from "../interfaces/TokenData";
import User from "../model/User/user.interface";
import UserModel from "../model/User/user.model";
import UserService from "./UserService";
import { Console } from "console";

class AuthService {

    private user = UserModel;
    private userService = UserService;

    authentication = async ( email: string, password: string ) => {
		const encryptedPassword = await this.encryptPassword(password);
        const user = await this.user.findOne({ email: email, password: encryptedPassword, isDeleted: false });
        console.log("user: ", user)
        return user;
    }

    generateToken( id: string ): Promise<any> {
		return new Promise(async (resolve, reject) => {
            try {
                const data = jwt.sign({
                    id,
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

    generateRefreshToken( id: string ): Promise<any> {
		return new Promise(async (resolve, reject) => {
            try {
                const data = jwt.sign({
                    id,
                    algorithm: config.tokenAlgorithm,
                    exp: Math.floor(Date.now() / 1000) + parseInt(config.tokenExpirationTime)
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

	getUpdatedUserWithTokens(id: string): Promise<any> {
		return new Promise(async (resolve, reject) => { 
			try {
				const token = await this.generateToken( id );
				const refreshToken = await this.generateRefreshToken( id );
				const tokenExpiryTime = await this.getTokenExpiryTime();

				const updatedUser = await this.user.findByIdAndUpdate(id, { token: token.data, refreshToken: refreshToken.data, tokenExpiryTime: tokenExpiryTime.data }, { new: true })

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
                    const encryptedPassword = await bcrypt.hash( password, salt );
                    return resolve(encryptedPassword);
                }
                throw new Error('Password shound not be empty or blank')
            } catch (error) {
                reject(error);
            }
        });

	}

	validatePassword( data: any ): any {
		try {
			if (data && data.password) {
				if (data.firstName && _.isEqual(data.password, data.firstName)) {
					return { status: 0, message: i18n.__("PASSWORD_NOT_SAME_FIRSTNAME") };
				}
				// Check new password is already used or not
				// if (dontAllowPreviouslyUsedPassword && data.userObj && data.userObj.previouslyUsedPasswords && Array.isArray(data.userObj.previouslyUsedPasswords) && data.userObj.previouslyUsedPasswords.length) {
				// 	let isPreviouslyUsed = _.filter(data.userObj.previouslyUsedPasswords, (previouslyUsedPassword) => {
				// 		let base64data = Buffer.from(previouslyUsedPassword, 'binary').toString();
				// 		return bcrypt.compareSync(data.password, base64data)
						
				// 	});
				// 	if (isPreviouslyUsed && Array.isArray(isPreviouslyUsed) && isPreviouslyUsed.length) {
				// 		return resolve({ status: 0, message: i18n.__("ALREADY_USED_PASSWORD") });
				// 	}
				// }
				return { status: 1, message: "Valid password." };
			} else {
				return { status: 0, message: "Password required." };
			}
		} catch (error) {
			console.log("===> ",error)
			return { status: 0, message: "Password not valid" };;
		}

	}
}
export default new AuthService();