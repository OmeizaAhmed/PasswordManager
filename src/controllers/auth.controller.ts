import type { Request, Response } from "express";
import sanitize from "sanitize-html";
import bcrypt from 'bcrypt';
import { pool } from "../database/db.js";
import type { QueryResult } from "pg";
import { doesEntityExist, signJWT } from "../utils/utils.js";

interface userDetail{
  userid: number
  username: string
  email: string
  passwordhash: string
  datecreated: Date
}
export const handleLogin = async (req: Request, res: Response) =>{
  try {
    // recieve and clean user input
    const { email, password } = req.body;
  
    if(!email || !password){
      return res.status(400).send("Invalid credientials");
    }
  
    const cleanEmail = sanitize(email.trim());
    const cleanPassword = sanitize(password.trim());
    // check if the user with the email exist 
    const user: userDetail | undefined = (await pool.query<userDetail>("SELECT * FROM Users WHERE Email = $1", [cleanEmail])).rows[0];

    if(!user) return res.status(400).send("Invalid credientials");

    // compare password
  
    const isValid = await bcrypt.compare(cleanPassword, user?.passwordhash)

    if(!isValid) return res.status(400).send("Invalid credientials");
    // generate jwt
    const authenticatedUser = {
      id: user.userid,
      name: user.username,
      email: user.email

    }
    const token = signJWT(authenticatedUser);
  
    // send response

    res.status(200).send({message: 'User signin successfully',
      data: {
        token,
        user: authenticatedUser
      }});
    
  } catch (error) {
    if(error instanceof Error){
      console.error(error.message)
    } else {
    console.error('An unknown error occurred:', error);
    }
    res.status(500).send("Internal Server Error")
  }



  
}

export const handleRegister= async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
  
    if(!name || !email || !password){
      return res.status(400).send("Incomplete credientials");
    }
  
    // SANITIZE INPUT
  
    const cleanName = sanitize(name.trim());
    const cleanEmail = sanitize(email.trim());
    const cleanPassword = sanitize(password.trim());
  
    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(cleanPassword, salt);
    // CHECK IF USER WITH THE EMAIL EXIST
    const existingUser = await doesEntityExist("Users", "Email", cleanEmail);
    if(existingUser) return res.status(409).send("User with this email already exist");
    // STORE USER INTO DATABASE
    const sqlQuery = "INSERT INTO Users(UserName, Email, PasswordHash) VALUES($1, $2, $3) RETURNING * ;";
    const createdUser: userDetail[] = (await pool.query(sqlQuery, [cleanName, cleanEmail ,hashedPassword])).rows;
    
    if(createdUser.length === 0) return res.status(500).send("An Error Occurred");
    const user = createdUser[0];
    if(!user) return res.status(500).send("An Error Occurred");
    const newUser = {
      id: user.userid,
      name: user.username,
      email: user.email

    }
  
    // SIGN JWT
  
    const token = signJWT(newUser);

    res.status(201).send({message: 'User created successfully',
      data: {
        token,
        user: newUser
      }});
    
    
  } catch (error) {
    if(error instanceof Error){
      console.error(error.message)
    } else {
    console.error('An unknown error occurred:', error);
  }
    res.status(500).send("Internal Server Error")
  }  
}