import { Router, Request, Response } from "express";

const routes = Router();
import init from './init'

// Add routes
routes.use( "/init", init );

export default routes;