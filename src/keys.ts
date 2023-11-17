import dotenv from "dotenv"
dotenv.config()

export const JWT_SIGNATURE = process.env.JWT_SIGNATURE as string