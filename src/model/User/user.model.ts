import { Document, Schema, Model, model, Types, mongo, Mongoose,  } from "mongoose";
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
    role: { type: String, enum: ['USER', 'ADMIN'] },
    password: { type: String },
    mobile: {
        type: String, default: null,
        index: {
            unique: true,
            partialFilterExpression: { mobile: { $type: 'string' } },
        },
        unique: 'Two users cannot share the same mobile number ({VALUE})'
    },
    dialCode: { type: String },
    /** Verification Related */
    emailVerificationStatus: { type: Boolean, default: false },
    mobileVerificationStatus: { type: Boolean, default: false },
    otp: { type: String },
    otpExpireOn: { type: Date },
    mobileOTP: { type: String },
    mobileOTPExpireOn: { type: Date },
    otpType: { type: String },

    /** Social login */
    fbId: { type: String },
    googleId: { type: String },
    appleId: { type: String },
    twitterId: { type: String },
    instagramId: { type: String },

    /** Tokens */
    verificationToken: { type: String },
    verificationTokenCreationTime: { type: Date },
    token: { type: String },
    tokenExpiryTime: { type: Date },
    refreshToken: { type: String },
    device: { type: String },
    deviceToken: { type: String },
    forgotToken: { type: String },
    forgotTokenCreationTime: { type: Date },

    ipAddress: { type: String },
    failedAttempts: [
        { ip: { type: String }, attempts: { type: Number }, blockedDate: { type: Date }, isBlocked: { type: Boolean, default: false } }
    ],
    previouslyUsedPasswords: [{ type: String }],
    passwordUpdatedAt: { type: Date },
    lastSeen: { type: Date },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true } );

UserSchema.pre<IUser>('save', function (this, next) {
    // capitalize
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
    this.email = this.email.toLowerCase();
    next();
});

const UserModel: IUserModel = ( model<IUser & IUserModel>(
    "User",
    UserSchema,
) as unknown ) as IUserModel;

export default UserModel;

