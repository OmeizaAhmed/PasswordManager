import { pool } from "../database/db.js";
import jwt from "jsonwebtoken";
import { ENV } from "../config.js";

interface passwordDetailType{
  PasswordID: number
  PasswordName: string
  Password: string
  DateCreated: Date
}

interface jwtPayloadType{
    id: number,
    email: string
    name: string
}

export const generatePassword = (length: number = 12): string =>{
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    return Array(length).fill("").map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
}


export const doesPasswordExist = async (passwordId: string): Promise<boolean> => {
    const passwordDetail: passwordDetailType[] = (await pool.query<passwordDetailType>(`SELECT * FROM Passwords WHERE PasswordID = $1;`, [passwordId])).rows;
    
    return passwordDetail.length === 0? false : true;
};

export const doesEntityExist = async (tableName: string, columnName: string, entity: string): Promise<boolean> => {
    const entityRow = (await pool.query<passwordDetailType>(`SELECT * FROM ${tableName} WHERE ${columnName} = $1;`, [entity])).rows;
    
    return entityRow.length === 0? false : true;
};

export const signJWT = (payload: jwtPayloadType): string =>{
    const token = jwt.sign(payload, ENV.JWT_SECRET_KEY, {expiresIn: ENV.JWT_LIFETIME});
    return token;
}