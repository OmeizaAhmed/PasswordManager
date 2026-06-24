import { Pool } from 'pg';
export const pool = new Pool({
    user: 'postgres',
    password: 'omeiza81',
    host: 'localhost',
    port: 5432,
    database: "PasswordManager"
});
//# sourceMappingURL=db.js.map