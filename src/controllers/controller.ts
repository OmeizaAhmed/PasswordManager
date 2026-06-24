import type { Request, Response } from "express";

export const getPasswords = (req: Request, res: Response) => {
  res.json({message: "This is the all password route"});
};

export const getPassword = (req: Request, res: Response) => {
  const {id} = req.params;
  res.json({message: `This is password ${id} route`});
};

export const addPassword = (req: Request, res: Response) => {
  res.json({message: "Password have been added"});
};

export const deletePassword = (req: Request, res: Response) => {
  const {id} = req.params;
  res.json({message: `Password with id: ${id} has been deleted`});
};

export const editPassword = (req: Request, res: Response) => {
  const {id} = req.params;
  res.json({message: `Password with id: ${id} has been edited`});
};

