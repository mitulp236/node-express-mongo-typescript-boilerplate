import { Request, Response, NextFunction } from "express";
import UnAuthenticationException from "../exceptions/UnAuthenticationException";
import RequestWithUser from "../interfaces/RequestWithUser";


export const checkRole = ( roles: Array<string> ) => {
    return async ( req: RequestWithUser, res: Response, next: NextFunction ) => {
        if ( roles.indexOf( req.user.role ) > -1 ) next();
        else res.status( 403 ).send( new UnAuthenticationException() );
    };
};