import {Pool} from 'pg';
import { ENV } from '../config.js';

export const pool = new Pool({
  user: 'postgres',
  password: ENV.DATABASE_PASSWORD,
  host: 'localhost',
  port: 5432,
  database: "passwordmanager"
});