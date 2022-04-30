import { Router, Request, Response } from "express";

const routes = Router();
import init from './init'
import user from './user'
import auth from './auth'

// Add routes
routes.use( "/init", init );
routes.use( "/user", user );
routes.use( "/auth", auth );

export default routes;