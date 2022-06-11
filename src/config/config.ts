export default {
    jwtSecret: "ThisIsTheUniqueJWTSecretHA",
    jwtRefreshTokenSecret: "kjbskfbksjfknlakbfkjabkfjafasfsfa",
    resetPasswordSecret: "Thisismyresetpasswordtoken",
    appDateFormate: "YYYY-MM-DD",
    year: "YYYY",
    tokenAlgorithm: 'HS256',
    // In minutes = 20 hours
    tokenExpirationTime: '12000',
    refreshTokenExpirationTime: '360000',
    dontAllowPreviouslyUsedPassword: true
};

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
}

