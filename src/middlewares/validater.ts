import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { RequestHandler } from "express";
import HttpException from "../exceptions/HttpException";
import InternalServerException from "../exceptions/InternalServerException";

function validationMiddleware<T>(
    type: any,
    skipMissingProperties = false,
): RequestHandler {
    return ( req, res, next ) => {
        console.log( req.body );
        validate( plainToClass( type, req.body ), { skipMissingProperties } )
            .then( ( errors: ValidationError[] ) => {
                console.log( errors );
                if ( errors.length > 0 )
                {
                    const message = errors
                        .map( ( error: ValidationError ) =>
                            Object.values(
                                error.constraints != null
                                    ? error.constraints
                                    : error.children.map( ( error: ValidationError ) =>
                                        Object.values(
                                            error.constraints != null
                                                ? error.constraints
                                                : error.children.map( ( error: ValidationError ) =>
                                                    Object.values( error.constraints ),
                                                ),
                                        ),
                                    ),
                            ),
                        )
                        .join( ", " );
                    //next(new HttpException(400, message));
                    res.status( 400 ).send( new HttpException( 400, message ) );
                } else
                {
                    next();
                }
            } )
            .catch( ( e ) => {
                console.log( e );
                res.status( 500 ).send( new InternalServerException( e ) );
            } );
    };
}

export default validationMiddleware;