export default {
    jwtSecret: "ThisIsTheUniqueJWTSecretHA",
    resetPasswordSecret: "Thisismyresetpasswordtoken",
    appDateFormate: "YYYY-MM-DD",
    year: "YYYY",
};

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
}