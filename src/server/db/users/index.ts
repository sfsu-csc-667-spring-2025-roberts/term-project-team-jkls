import db from "../connection"
import bcrypt from "bcrypt";

export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    profile_pic: string;
}

const register = async (email: string, password: string, username: string, profilePic: string ) => {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const {id} = await db.one("INSERT INTO users (email, password, username, gravatar) VALUES ($1, $2, $3, $4) RETURNING id", [email, encryptedPassword, username, profilePic]);

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