import type { Request, Response } from "express";
import type { QueryResult } from "pg";
import { pool } from "../database/db.js";
import sanitize from "sanitize-html";
import { doesPasswordExist, generatePassword } from "../utils/utils.js";

interface passwordType{
  PasswordID: number
  PasswordName: string
};

interface passwordDetailType{
  PasswordID: number
  PasswordName: string
  Password: string
  DateCreated: Date
}

export const getPasswords = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if(!userId){
      res.status(401).json({ message: 'Unauthorized'});
      return;
    }
    const sqlQuery: string = `SELECT PasswordID, PasswordName FROM Passwords WHERE UserID = $1;`;
    const passwords: passwordType[] = (await pool.query<passwordType>(sqlQuery, [userId])).rows;
    if (passwords.length === 0){
      res.send({message: "You have no password"});
      return;
    }
    res.send(passwords);
  } catch (error) {
    if(error instanceof Error){
      console.error(error.message)
    }else {
    console.error('An unknown error occurred:', error);
    }
    res.status(500).send("Internal Server Error")
  }
};

export const getPassword = async (req: Request, res: Response) => {
  const userId = req.userId;
    if(!userId){
      res.status(401).json({ message: 'Unauthorized'});
      return;
    }
  let {id}  = req.params;
  if(!id){
    res.status(400).send("Bad Request");
    return;
  }
  try{
    const sqlQuery = `SELECT * FROM Passwords WHERE PasswordID = $1 AND UserID = $2;`
    const passwordDetail: QueryResult<passwordDetailType> = (await pool.query<passwordDetailType>(sqlQuery, [id, userId]));
    if(passwordDetail.rowCount == 0){
      res.status(404).send("Not Found");
      return;
    }
    res.send(passwordDetail.rows[0]);
  } catch(error){
    if(error instanceof Error){
      console.error(error.message)
    }
    res.status(500).send("Internal Server Error")

  }
  

};

export const addPassword = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if(!userId){
      res.status(401).json({ message: 'Unauthorized'});
      return;
    }
    const body = req.body;
    const name: string = body?.name;
    let password: string = body?.password;
    if(!name){
      res.status(400).send("Password must have a name");
      return;
    }
    const passwordName: string = sanitize(name);
    if(!password || password.trim() == ""){
      password = generatePassword(); 
    }
    const sqlQuery = `INSERT INTO Passwords(PasswordName, Password, UserID) VALUES($1, $2, $3) RETURNING * ;`;
    const createdPassword: QueryResult<passwordDetailType> = await pool.query<passwordDetailType>(sqlQuery, [passwordName, password, userId]);
    if(createdPassword.rowCount === 0){
      res.status(500).send("An Error occurred");
      return;
    }
    res.status(201).send(createdPassword.rows[0])

  } catch (error) {
    if(error instanceof Error){
      console.error(error.message)
    }else {
    console.error('An unknown error occurred:', error);
  }
    res.status(500).send("Internal Server Error")

  }
  
  };

export const deletePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if(!userId){
      res.status(401).json({ message: 'Unauthorized'});
      return;
    }
    const {id} = req.params;
    if(!id || typeof id !== "string"){
      res.status(400).send("Bad Request");
      return;
    }
    
    // check if the password exist
    if(!await doesPasswordExist(id, userId)){
      res.status(404).send("Not Found");
      return;
    }

    const sqlQuery: string = "DELETE FROM Passwords WHERE PasswordID = $1 AND UserID = $2";
    
    const deletePasword: QueryResult<passwordDetailType> = await pool.query<passwordDetailType>(sqlQuery, [id, userId]);

    res.status(204).send();
  } catch (error) {
    if(error instanceof Error){
      console.error(error.message)
    }else {
    console.error('An unknown error occurred:', error);
  }
    res.status(500).send("Internal Server Error");
  };
};

export const editPassword = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if(!userId){
      res.status(401).json({ message: 'Unauthorized'});
      return;
    }
    const {id} = req.params;
    const body = req.body;
    const name: string = body?.name;
    const password: string = body?.password;
    if(!name?.trim() || !password?.trim()){
      res.status(400).send("Password and Password name are required");
      return;
    }
    if(!id || typeof id !== "string"){
      res.status(400).send("Bad Request");
      return;
    }
    
    // check if the password exist
    if(!await doesPasswordExist(id, userId)){
      res.status(404).send("Not Found");
      return;
    }

    const sqlQuery: string = "UPDATE Passwords SET PasswordName = $1, Password = $2 WHERE PasswordID = $3 AND UserID = $4 RETURNING * ;";
    
    const updatePassword: QueryResult<passwordDetailType> = await pool.query<passwordDetailType>(sqlQuery, [name, password, id, userId]);

    res.status(200).send(updatePassword.rows[0]);
  } catch (error) {
    if(error instanceof Error){
      console.error(error.message)
    }else {
    console.error('An unknown error occurred:', error);
  }
    res.status(500).send("Internal Server Error");
  };
};


export const shufflePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if(!userId){
      res.status(401).json({ message: 'Unauthorized'});
      return;
    }
    const {id} = req.params;
    if(!id || typeof id !== "string"){
      res.status(400).send("Bad Request");
      return;
    }
    
    // check if the password exist
    if(!await doesPasswordExist(id, userId)){
      res.status(404).send("Not Found");
      return;
    }
    const randomPassword = generatePassword();

    const sqlQuery: string = "UPDATE Passwords SET Password = $1 WHERE PasswordID = $2 AND UserID = $3 RETURNING * ;";
    
    const updatePassword: QueryResult<passwordDetailType> = await pool.query<passwordDetailType>(sqlQuery, [randomPassword, id, userId]);

    res.status(200).send(updatePassword.rows[0]);
  } catch (error) {
    if(error instanceof Error){
      console.error(error.message)
    } else {
    console.error('An unknown error occurred:', error);
  }
    res.status(500).send("Internal Server Error");
  };
};

