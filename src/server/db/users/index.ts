import db from "../connection"
import bcrypt from "bcrypt";

export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
}

const register = async (email: string, password: string, username: string) => {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const {id} = await db.one("INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING id", [email, encryptedPassword, username]);

    const user = await db.one<User>("SELECT * FROM users WHERE id = $1", [id]);

    return user;
};

const login = async (email: string, password: string) => {
    const user = await db.one<User>("SELECT * FROM users WHERE email = $1", [email])

    const passwordsMatch = await bcrypt.compare(password, user.password)

    if (passwordsMatch) {
        return user
    } else {
        throw new Error("Invalid password")
    }

};

export default { register, login };