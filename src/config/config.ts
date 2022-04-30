export default {
    jwtSecret: "ThisIsTheUniqueJWTSecretHA",
    jwtRefreshTokenSecret: "kjbskfbksjfknlakbfkjabkfjafasfsfa",
    resetPasswordSecret: "Thisismyresetpasswordtoken",
    appDateFormate: "YYYY-MM-DD",
    year: "YYYY",
    tokenAlgorithm: 'HS256',
    // In minutes = 20 hours
    tokenExpirationTime: '1200',
};

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
}

export const dontAllowPreviouslyUsedPassword = true;
