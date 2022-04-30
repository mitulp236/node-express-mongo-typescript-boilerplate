import * as mongoose from "mongoose";
import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import * as swaggerUi from "swagger-ui-express"
const swaggerDocument = require( '../swagger.json' );
import * as helmet from "helmet";
import "./config/env";
import routes from "./routes";
import logger from "./logger";
import * as i18n from"i18n"

export const root = __dirname;
export const app = express();

// en: Engilsh, es: Spanish, de: German, fr: French, pt: Portuguese
i18n.configure({
    // locales: ['en', 'es', 'de'],
    locales: ['en'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    register: global,
});


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
        app.use(express.json());
        app.use(express.urlencoded({
            extended: true
        }));

        // routes
        if(process.env.NODE_ENV !== 'production') {
            app.use( '/api-docs', swaggerUi.serve, swaggerUi.setup( swaggerDocument ) );
        }
        app.use( "/api", routes );

        // server settings
        app.set( "port", process.env.PORT || 4000 );
        app.listen( app.get( "port" ), process.env.HOST_NAME, () => {
            console.log(
                "App is running at " + process.env.HOST_NAME + ":%d in %s mode",
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