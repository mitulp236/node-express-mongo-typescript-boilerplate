import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as i18n from "i18n"
import config from "../config/config";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import RequestWithUser from "../interfaces/RequestWithUser";
import DataStoredInToken from "../interfaces/DataStoredInToken";
import UserService from "../services/UserService";

export const auth = async ( req: RequestWithUser, res: Response, next: NextFunction ) => {
    
    //Get the jwt token from the header
    const token = <string> req.headers["authorization"];
    let verificationResponse: DataStoredInToken;
    try {
        verificationResponse = ( <any>(jwt.verify( token, config.jwtSecret )) ) as DataStoredInToken;
        
        const id = verificationResponse._id;
        const user = await UserService.getUserById( id );
        if ( user ){
            req.user = user;
            if ( req.user.isDeleted == true ) {
                return res.status( 403 ).send( { error: i18n.__('USER_NOT_EXIST_OR_DELETED') } );
            }
            if( req.user.isVerified == false) {
                return res.status( 403 ).send( { error: i18n.__("USER_NOT_VERIFIED") } );
            }
            else if ( req.user.emailVerificationStatus == false ) {
                return res.status( 403 ).send( { error: i18n.__("USER_NOT_VERIFIED") } );
            }
            else {
                next();
            }
        } else {
            res.status( 401 ).send( new WrongAuthenticationTokenException() )
        }
    } catch ( error ) {
        res.status( 401 ).send( new WrongAuthenticationTokenException() )
    }
};