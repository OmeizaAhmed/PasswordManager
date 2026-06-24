import express from 'express';
import { PasswordManagerRouter } from './routes/route.js';
const app = express();
const PORT = 3000;
app.use(express.json());
app.use((req, res, next) => {
    try {
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        res.status(500).send("Internal Server Error");
    }
});
app.use("/api/password", PasswordManagerRouter);
app.get('/', (req, res) => {
    res.send({ message: 'I am Root :)' });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map