import { Document } from "mongoose";

interface User extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
    mobile: string;
    dialCode: string;
    /** Verification Related */
    emailVerificationStatus: boolean;
    mobileVerificationStatus: boolean;
    otp: string;
    otpExpireOn: Date;
    mobileOTP: Date;
    mobileOTPExpireOn: Date;
    otpType: string;
    /** Social login */
    fbId: string;
    googleId: string;
    appleId: string;
    twitterId: string;
    instagramId: string;
    /** Tokens */
    verificationToken: string;
    verificationTokenCreationTime: Date;
    token: string;
    tokenExpiryTime: Date;
    refreshToken: string;
    device: string;
    deviceToken: string;
    forgotToken: string;
    forgotTokenCreationTime: Date;
    /** Other information */
    ipAddress: string;
    failedAttempts: [Object]
    previouslyUsedPasswords: [string];
    passwordUpdatedAt: Date;
    lastSeen: Date;
    isVerified: boolean;
    isDeleted: boolean;
}

export default User;