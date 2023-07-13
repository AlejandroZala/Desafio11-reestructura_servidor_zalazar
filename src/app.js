import express from 'express';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import config from './config/config.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import {Server} from 'socket.io';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/session.router.js';
import initializePassportStrategies from './config/passport.config.js';
import registerChatHandler from './listeners/chatHandler.js';
import __dirname from './utils.js';


const app = express();
// const PORT = process.env.PORT ||8080;
const PORT = config.app.PORT;
const server = app.listen(PORT,() => console.log(`Listening on port ${PORT}`));
mongoose.connect(config.mongo.URL)
const io = new Server(server);      //Levanto mi server

//CONFIGURACION MAILING
const APP_PASSWORD = 'bcoeepwdoqommfmt';
const APP_EMAIL = 'alejandrodzalazar@gmail.com';
//Genero el vinculo entre el servico seleccionado y mi herramienta
const transport = nodemailer.createTransport({
    service: 'gmail',
    port:587,
    auth:{
        user:APP_EMAIL,
        pass:APP_PASSWORD
    }
});

app.get('/mail',async (req, res) => {
    const result = await transport.sendMail({
        from: 'Alejandro <alejandrodzalazar@gmail.com>',
        to:'galeza2012@hotmail.com',
        subject:'Correo de prueba mailing',
        html:`
        <div>
        <h1>ESTÉTICA PROFESIONAL</h1>
        <img src="cid:logo"/>
        <h1>Esta es un prueba de mailing en Backend</h1>
        </div>`,
        attachments:[
            {
                filename:'ListaPrecios.pdf',
                path:'./src/docs/listaPrecios.pdf'
            },
            {
                filename:'logoda.jpg',
                path:'./src/public/imagenes/logoda.jpg',
                cid:'logo'
            }
        ]
    })
    res.send({status:"success",payload:result})
})

//CONFIGURACIÓN MENSAJERÍA TWILIO
const TWILIO_NUMBER= '+18145593595'
const TWILIO_SID = 'AC9e13db7da5478040814b7b4a92c3c0d2';
const TWILIO_TOKEN = '9784f6eba4a4d97779f75502c3e641d5';

//TWILIO INICIALIZA AL CLIENTE
const twilioClient = twilio(TWILIO_SID,TWILIO_TOKEN);

app.get('/sms', async(req, res) => {
    const clientNumber = "+542235927124";
    const result = await twilioClient.messages.create({
        body: 'SMS de prueba',
        from: TWILIO_NUMBER,
        to:clientNumber
    })
    res.send({status:"success",payload:result})
})

app.engine('handlebars',handlebars.engine());   //Creo handlebars como motor de plantillas
app.set('views',`${__dirname}/views`);  //Apunto a la ruta de las vistas
app.set('view engine','handlebars');    //El motor que leerá las vistas es handlebars

//Middlewares del poder y del saber
app.use(express.json());//Me permite leer jsons en las peticiones.
app.use(express.urlencoded({extended:true})); //Objetos codificados desde URL
app.use(express.static(`${__dirname}/public`)); //permite acceder a imagenes dentro de la ruta

//creo middleware para referenciar mi io
app.use((req,res,next) => {
    req.io = io;
    next();
})

//Incorporo session para cookies, session, storage y logins con Mongo Atlas
app.use(session({
    store: new MongoStore({
        mongoUrl: "mongodb+srv://AleCoder:123@clusterale1.zf41tfw.mongodb.net/ecommerce?retryWrites=true&w=majority",
        ttl: 3600,
    }),
    secret: "Palabra-secreta",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
initializePassportStrategies();

app.use('/api/products', productsRouter); //Cuando llegue la peticion la redirije a usersRouter
app.use('/api/carts', cartsRouter);
app.use('/',viewsRouter);
app.use('/api/sessions', sessionsRouter);

io.on('connection',socket=>{
    registerChatHandler(io,socket);
    console.log("Socket conectado");
})