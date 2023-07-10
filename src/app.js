import express from 'express';
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