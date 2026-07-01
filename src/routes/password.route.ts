import { Router } from "express";
import { getPassword, getPasswords, addPassword, deletePassword, editPassword, shufflePassword } from "../controllers/password.controller.js";

export const PasswordRouter = Router();

PasswordRouter.get("/", getPasswords);
PasswordRouter.get("/:id", getPassword);
PasswordRouter.post("/", addPassword);
PasswordRouter.put("/:id", editPassword);
PasswordRouter.put("/:id/shuffle", shufflePassword);
PasswordRouter.delete("/:id",deletePassword);

