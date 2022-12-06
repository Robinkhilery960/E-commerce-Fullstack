import dotenv from "dotenv"

dotenv.config()

const config={
    JWT_SECRET:process.env.JWT_SECRET,
    JWT_EXPIRY:process.env.JWT_EXPIRY || "2h"
}

export default config