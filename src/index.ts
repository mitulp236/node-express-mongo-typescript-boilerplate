import * as mongoose from "mongoose";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as path from "path";
import * as swaggerUi from "swagger-ui-express"
const swaggerDocument = require( '../swagger.json' );
import * as helmet from "helmet";
import "./config/env";
import routes from "./routes";
import logger from "./logger";

export const root = __dirname;
export const app = express();

logger.info("information log")
logger.warn("warning log")
logger.error("error log")
logger.debug("debug log")

mongoose
    .connect( process.env.DATABASEURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        useFindAndModify: false,
    } )
    .then( async ( connection ) => {

        app.use( '/public', express.static( __dirname + '/public' ) );
        app.use( cors() );
        app.use( helmet() );
        app.use( bodyParser.json() );
        app.use( bodyParser.urlencoded( { extended: true } ) );

        // routes
        app.use( '/api-docs', swaggerUi.serve, swaggerUi.setup( swaggerDocument ) );
        app.use( "/api", routes );

        // server settings
        app.set( "port", process.env.PORT || 4000 );
        app.listen( app.get( "port" ), process.env.HOSTNAME, () => {
            console.log(
                "App is running at " + process.env.HOSTNAME + ":%d in %s mode",
                app.get( "port" ),
                app.get( "env" ),
            );
            console.log( "Press CTRL-C to stop\n" );
        } );
        app.on( "close", () => {
            app.removeAllListeners();
        } );
    } )
    .catch( ( error ) => console.log( error ) );