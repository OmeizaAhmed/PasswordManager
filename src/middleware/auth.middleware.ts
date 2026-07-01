import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { ENV } from '../config.js';

const JWT_SECRET = ENV.JWT_SECRET_KEY;

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if(!token){
    res.status(401).json({ message: 'Authorization token missing or malformed' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if((typeof(decoded) !== "string") && "id" in decoded){
      req.userId = decoded?.id;
    } else {
      res.status(401).json({ message: 'Unauthorized'});
      return;
    }
    next();
  } catch (error) {
    if(error instanceof Error){
      console.error(error.message);
    }
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }
};
