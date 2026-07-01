import type { Request, Response } from "express";

export const handleLogin = async (req: Request, res: Response) =>{
  res.send("Login Succesfull");
}

export const handleRegister= async (req: Request, res: Response) => {
  res.send("New user registered Successfully");
}