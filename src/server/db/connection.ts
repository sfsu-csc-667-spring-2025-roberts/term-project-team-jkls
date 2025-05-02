import pgp from 'pg-promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = pgp()(process.env.DATABASE_URL!)

export default connection;