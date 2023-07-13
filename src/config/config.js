import dotenv from 'dotenv';

dotenv.config();

export default {
    app:{
        PORT: process.env.PORT ||8080
    },
    mongo:{
        URL: process.env.MONGO_URL || 'localhost:27017'
    },
    nodemailer:{
        APP_PASSWORD: process.env.APP_PASSWORD,
        APP_EMAIL: process.env.APP_EMAIL
    },
    twilio:{
        CLIENT_NUMBER: process.env.CLIENT_NUMBER,
        TWILIO_NUMBER: process.env.TWILIO_NUMBER,
        TWILIO_SID: process.env.TWILIO_SID,
        TWILIO_TOKEN: process.env.TWILIO_TOKEN
    }
}