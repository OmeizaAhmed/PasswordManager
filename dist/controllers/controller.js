import { pool } from "../database/db.js";
import sanitize from "sanitize-html";
import { generatePassword } from "../utils/passwordGenerator.js";
;
export const getPasswords = async (req, res) => {
    try {
        const sqlQuery = `SELECT PasswordID, PasswordName FROM Passwords;`;
        const passwords = (await pool.query(sqlQuery)).rows;
        if (passwords.length === 0) {
            res.send({ message: "You have no password" });
        }
        res.send(passwords);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        res.status(500).send("Internal Server Error");
    }
};
export const getPassword = async (req, res) => {
    let { id } = req.params;
    if (!id) {
        res.status(400).send("Bad Request");
        return;
    }
    try {
        const sqlQuery = `SELECT * FROM Passwords WHERE PasswordID = $1;`;
        const passwordDetail = (await pool.query(sqlQuery, [id]));
        if (passwordDetail.rowCount == 0) {
            res.status(404).send("Not Found");
            return;
        }
        res.send(passwordDetail.rows[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        res.status(500).send("Internal Server Error");
    }
};
export const addPassword = async (req, res) => {
    let { name, password } = req.body;
    if (!name) {
        res.status(400).send("Password must have a name");
        return;
    }
    const passwordName = sanitize(name);
    if (!password || password.trim() == "") {
        password = generatePassword();
    }
    try {
        const sqlQuery = `INSERT INTO Passwords(PasswordName, Password) VALUES($1, $2) RETURNING * ;`;
        const createdPassword = await pool.query(sqlQuery, [passwordName, password]);
        if (createdPassword.rowCount === 0) {
            res.status(500).send("An Error occurred");
            return;
        }
        res.send(createdPassword.rows[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        res.status(500).send("Internal Server Error");
    }
};
export const deletePassword = (req, res) => {
    const { id } = req.params;
    res.json({ message: `Password with id: ${id} has been deleted` });
};
export const editPassword = (req, res) => {
    const { id } = req.params;
    res.json({ message: `Password with id: ${id} has been edited` });
};
//# sourceMappingURL=controller.js.map