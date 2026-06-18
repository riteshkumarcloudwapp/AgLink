import dotenv from "dotenv";

dotenv.config();  //.env file ko read karta hai aur sab variables ko process.env mein load karta hai

const config = {
    PORT : process.env.PORT || 5000,
    HOST : process.env.HOST,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY
}

export default config;