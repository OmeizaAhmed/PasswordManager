import {Pool} from 'pg';
import { DATABASE_PASSWORD } from '../config.js';

export const pool = new Pool({
  user: 'postgres',
  password: DATABASE_PASSWORD,
  host: 'localhost',
  port: 5432,
  database: "passwordmanager"
});