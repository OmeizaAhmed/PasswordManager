import { Router } from "express";
import { handleLogin, handleRegister } from "../controllers/auth.controller.js";

export const AuthRouter = Router();

AuthRouter.post("/register", handleRegister);
AuthRouter.post("/login", handleLogin);