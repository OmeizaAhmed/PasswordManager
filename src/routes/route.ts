import { Router } from "express";
import { getPassword, getPasswords, addPassword, deletePassword, editPassword } from "../controllers/controller.js";

export const PasswordManagerRouter = Router();

PasswordManagerRouter.get("/", getPasswords);
PasswordManagerRouter.get("/:id", getPassword);
PasswordManagerRouter.post("/", addPassword);
PasswordManagerRouter.put("/:id", editPassword);
PasswordManagerRouter.delete("/:id",deletePassword);

