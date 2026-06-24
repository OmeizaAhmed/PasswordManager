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
    const body = req.body;
    const name = body?.name;
    let password = body?.password;
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
        res.status(201).send(createdPassword.rows[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        res.status(500).send("Internal Server Error");
    }
};
export const deletePassword = async (req, res) => {
    const { id } = req.params;
    try {
        // check if the password exist
        const passwordDetail = (await pool.query(`SELECT * FROM Passwords WHERE PasswordID = $1;`, [id])).rows;
        if (passwordDetail.length == 0) {
            res.status(404).send("Not Found");
            return;
        }
        const sqlQuery = "DELETE FROM Passwords WHERE PasswordID = $1";
        const deletePasword = await pool.query(sqlQuery, [id]);
        res.status(204).send();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        res.status(500).send("Internal Server Error");
    }
    ;
};
export const editPassword = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const name = body?.name;
    const password = body?.password;
    if (!name?.trim() || !password?.trim()) {
        res.status(400).send("Password and Password name are required");
        return;
    }
    try {
        // check if the password exist
        const passwordDetail = (await pool.query(`SELECT * FROM Passwords WHERE PasswordID = $1;`, [id])).rows;
        if (passwordDetail.length == 0) {
            res.status(404).send("Not Found");
            return;
        }
        const sqlQuery = "UPDATE Passwords SET PasswordName = $1, Password = $2 WHERE PasswordID = $3 RETURNING * ;";
        const updatePassword = await pool.query(sqlQuery, [name, password, id]);
        res.status(200).send(updatePassword.rows[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        res.status(500).send("Internal Server Error");
    }
    ;
};
export const shufflePassword = async (req, res) => {
    const { id } = req.params;
    try {
        // check if the password exist
        const passwordDetail = (await pool.query(`SELECT * FROM Passwords WHERE PasswordID = $1;`, [id])).rows;
        if (passwordDetail.length == 0) {
            res.status(404).send("Not Found");
            return;
        }
        const randomPassword = generatePassword();
        const sqlQuery = "UPDATE Passwords SET Password = $1 WHERE PasswordID = $2 RETURNING * ;";
        const updatePassword = await pool.query(sqlQuery, [randomPassword, id]);
        res.status(200).send(updatePassword.rows[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        res.status(500).send("Internal Server Error");
    }
    ;
};
//# sourceMappingURL=controller.js.map