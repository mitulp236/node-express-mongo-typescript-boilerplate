import { Request, Response } from "express";

class InitialController {

    init = async ( req: Request, res: Response ) => {
        res.status( 200 ).send( { message: "Server is started 🔥" } )
    }
}
export default new InitialController();