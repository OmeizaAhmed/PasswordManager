import { pool } from "../database/db.js";

interface passwordDetailType{
  PasswordID: number
  PasswordName: string
  Password: string
  DateCreated: Date
}

export const generatePassword = (length: number = 12): string =>{
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    return Array(length).fill("").map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
}


export const doesPasswordExist = async (passwordId: string): Promise<boolean> => {
    const passwordDetail: passwordDetailType[] = (await pool.query<passwordDetailType>(`SELECT * FROM Passwords WHERE PasswordID = $1;`, [passwordId])).rows;
    
    return passwordDetail.length === 0? false : true;
};