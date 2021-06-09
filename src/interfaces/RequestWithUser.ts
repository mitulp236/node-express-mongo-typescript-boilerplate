import { Request } from "express";
import User from "../model/User/user.interface";

interface RequestWithUser extends Request {
    user: User;
    // role: string;
    // roleId: string;
}

export default RequestWithUser;