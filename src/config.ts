import dotenv from 'dotenv';

dotenv.config();

const databasePassword = process.env.DATABASE_PASSWORD;
if (!databasePassword) throw new Error("DATABASE PASSWORD CANNOT BE EMPTY");

const jwtSecret = process.env.JWT_SECRET_KEY;
if (!jwtSecret) throw new Error("JWT SECRET KEY CANNOT BE EMPTY");

const jwtLifetime = Number(process.env.JWT_LIFETIME);
if (!jwtSecret || 0) throw new Error("JWT EXPIRE TIME CANNOT BE EMPTY");

export const ENV = {DATABASE_PASSWORD: databasePassword, JWT_SECRET_KEY: jwtSecret, JWT_LIFETIME: jwtLifetime};
