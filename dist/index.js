import express from 'express';
import { PasswordManagerRouter } from './routes/route.js';
const app = express();
const PORT = 3000;
app.use(express.json());
app.use("/api/password", PasswordManagerRouter);
app.get('/', (req, res) => {
    res.send({ message: 'Hello from TypeScript Express!' });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map