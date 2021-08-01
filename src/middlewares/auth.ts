import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import RequestWithUser from "../interfaces/RequestWithUser";
import DataStoredInToken from "../interfaces/DataStoredInToken";
import userModel from "../model/User/user.model";

export const auth = async ( req: RequestWithUser, res: Response, next: NextFunction ) => {
    const token = <string> req.headers["authorization"];
    let verificationResponse: DataStoredInToken;
    try
    {
        verificationResponse = <any> jwt.verify( token, config.jwtSecret ) as DataStoredInToken;
        const id = verificationResponse._id;
        const user = await userModel.findById( id );
        if ( user )
        {
            req.user = user;
            if ( req.user.isVerify == false )
            {
                res.status( 403 ).send( { "message": "You are not verify.", data: { isverify: false } } );
            }
            else if ( req.user.isActive == false )
            {
                res.status( 403 ).send( { "message": "You are inactive.", data: { isactive: false } } );
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