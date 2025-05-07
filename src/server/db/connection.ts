import pgPromise from 'pg-promise';
import dotenv from 'dotenv';
dotenv.config();

console.log(" DATABASE_URL =", process.env.DATABASE_URL);

const pgp = pgPromise();
const db = pgp(process.env.DATABASE_URL!);

export default db;
