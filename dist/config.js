import dotenv from 'dotenv';
dotenv.config();
const databasePassword = process.env.DATABASE_PASSWORD;
if (!databasePassword)
    throw new Error("DATABASE PASSWORD CANNOT BE EMPTY");
export const DATABASE_PASSWORD = databasePassword;
//# sourceMappingURL=config.js.map