import { Document } from "mongoose";

interface User extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    resetToken: string;
    expireToken: Date;
    isVerify: boolean;
    isActive: boolean;
}

export default User;