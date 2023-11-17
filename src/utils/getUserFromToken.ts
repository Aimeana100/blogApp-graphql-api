import jwt from "jsonwebtoken"
import { JWT_SIGNATURE } from "../keys"

export const userFromToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SIGNATURE) as { userId: number}
        
    } catch (error) {
        return null;
    }
}