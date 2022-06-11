import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as i18n from "i18n"
import config from "../config/config";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import RequestWithUser from "../interfaces/RequestWithUser";
import DataStoredInToken from "../interfaces/DataStoredInToken";
import userModel from "../model/User/user.model";
import UserService from "../services/UserService";


export const auth = async ( req: RequestWithUser, res: Response, next: NextFunction ) => {
    
    const token = <string> req.headers["authorization"];
    let verificationResponse: DataStoredInToken;
    try
    {
        verificationResponse = <any> jwt.verify( token, config.jwtSecret ) as DataStoredInToken;
        const id = verificationResponse.id;
        const user = await userModel.findById( id );
        console.log("user: ", user)
        if ( user )
        {
            req.user = user;
            if ( req.user.isDeleted == false )
            {
                res.status( 403 ).send( { error: i18n.__('USER_NOT_EXIST') } );
            }
            if( req.user.isVerified == false) {
                res.status( 403 ).send( { error: "USER_NOT_VERIFIED" } );
            }
            else if ( req.user.emailVerificationStatus == false )
            {
                res.status( 403 ).send( { error: "USER_NOT_VERIFIED" } );
            }
            else
            {
                next();
            }
        } else
        {
            res.status( 401 ).send( new WrongAuthenticationTokenException() )

        }
    } catch ( error )
    {
        res.status( 401 ).send( new WrongAuthenticationTokenException() )
    }
};