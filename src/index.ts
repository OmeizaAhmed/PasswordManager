import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { PasswordRouter } from './routes/password.route.js';
import { AuthRouter } from './routes/auth.route.js';
import { authenticateJWT } from './middleware/auth.middleware.js';

const app = express();
const PORT = 3000;

app.use(express.json());



app.use("/api/auth", AuthRouter);
app.use("/api/password", authenticateJWT, PasswordRouter);


app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'I am Root :)' });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error('An unknown error occurred:', err);
  }
  
  res.status(500).send("Internal Server Error");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
