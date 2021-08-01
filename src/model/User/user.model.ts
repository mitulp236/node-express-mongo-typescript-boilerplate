import { Document, Schema, Model, model, Types, mongo, Mongoose } from "mongoose";
import { Role } from "../../config/config";
import User from "./user.interface";
import * as mongoose from "mongoose"

export interface IUser extends User { }
//staticMethods
export interface IUserModel extends Model<IUser> { }

const UserSchema = new Schema( {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, default: false },
    resetToken: String,
    expireToken: Date,
    isVerify: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true } );

const UserModel: IUserModel = ( model<IUser & IUserModel>(
    "User",
    UserSchema,
) as unknown ) as IUserModel;

export default UserModel;

