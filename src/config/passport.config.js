import passport from 'passport';
import local from 'passport-local';
import GithubStrategy from 'passport-github2';
import userModel from '../dao/mongo/models/users.js';
import { cartsService } from "../dao/mongo/Managers/index.js"
import { createHash, validatePassword } from '../utils.js';

const LocalStrategy = local.Strategy; // UNA ESTRATEGIA LOCAL SIEMPRE SE BASA EN EL USERNAME + PASSWORD

const initializePassportStrategies = () => {
    passport.use(
        'register', 
        new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                const { first_name, last_name, age} = req.body;
                //Número 1! Corrobora si el usuario ya existe.
                const exists = await userModel.findOne({ email });
                //done lo que quiere hacer es DEVOLVERTE un usuario en req.user;
                if (exists)
                    return done(null, false, { message: 'El usuario ya existe' });
                //Número 2! Si el usuario no existe, ahora sí ENCRIPTAMOS SU CONTRASEÑA
                const hashedPassword = await createHash(password);
                //Número 3! Construimos el usuario que voy a registrar
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashedPassword,
                };
                const cart = await cartsService.createCart();
                user.cart = cart._id;
                const result = await userModel.create(user);

                //Si todo salió bien, Ahí es cuando done debe finalizar bien.
                done(null, result);
            } catch (error) {
                done(error);
            }
        }
        )
    );

    passport.use('login',new LocalStrategy({ usernameField: 'email' },
        async (email, password, done) => {
            //PASSPORT SÓLO DEBE DEVOLVER AL USUARIO FINAL, ÉL NO ES RESPONSABLE DE LA SESIÓN
            if (email === "adminCoder@coder.com"&&password==="adminCod3r123") {
                //Desde aquí ya puedo inicializar al admin.
                const user = {
                    id: 0,
                    name: `Admin`,
                    role: 'admin',
                    email: 'adminCoder@coder.com',
                    age: 50,
                };
                return done(null, user);
            }
            let user;
            //Número 1!!!!! buscar al usuario, ¿existe?
            user = await userModel.findOne({ email }); //Sólo busco por email
            if (!user) 
                return done(null, false, { message: 'Credenciales incorrectas' });

                //Número 2!!!! si sí existe el usuario, VERIFICA SU PASSWORD ENCRIPTADO
                const isValidPassword = await validatePassword(password, user.password);
            if (!isValidPassword)
                return done(null, false, { message: 'Contraseña inválida' });

                //Número 3!!! ¿El usuario existe y SÍ PUSO SU CONTRASEÑA CORRECTA? Como estoy en passport, sólo devuelvo al usuario
                user = {
                    id: user._id,
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    age: user.age,
                    role: user.role,
                };
                return done(null, user);
        })
    );

    passport.use("github", new GithubStrategy(
            {
                clientID: "Iv1.67570bccbab24d58",
                clientSecret: "e4aeff010a9830e40ac70450be13f1c40488ef41",
                callbackURL: "http://localhost:8080/api/sessions/githubcallback",
            },
            async (accesToken, refreshToken, profile, done) => {
                try {
                const { name } = profile._json;
                let emailGitHub = `${profile._json.login}@github.com`;
                const user = await userModel.findOne({ email: emailGitHub });
                console.log(user);
                if (!user) {
                    const newUser = {
                        first_name: name,
                        email: emailGitHub,
                        password: ""
                    };
                    const result = await userModel.create(newUser);
                    return done(null, result);
                }
                // si ya existe
                done(null, user);
                } catch (error) {
                done(error);
                }
            }
            )
        );

    passport.serializeUser(function (user, done) {
        return done(null, user.id);
    });
    passport.deserializeUser(async function (id, done) {
        if(id===0){
            return done(null,{
                role:"admin",
                name:"ADMIN"
            })
        }
        const user = await userModel.findOne({ _id: id });
        return done(null, user);
    });

};
export default initializePassportStrategies;