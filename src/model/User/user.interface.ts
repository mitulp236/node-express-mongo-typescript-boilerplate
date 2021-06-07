import { Document } from "mongoose";

interface User extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    resetToken: string;
    expireToken: Date;
    isActive: boolean;
}

export default User;