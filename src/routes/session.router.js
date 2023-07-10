import { Router } from "express";
import { usersService, cartsService } from "../dao/mongo/Managers/index.js"
import passport from 'passport';
import userModel from "../dao/mongo/models/users.js";
import cartManager from "../dao/mongo/Managers/cartManager.js";
import { createHash, validatePassword } from "../utils.js";

const router = Router();

router.post('/register',
    passport.authenticate('register',{failureRedirect:'/api/sessions/registerFail', failureMessage:true}),async(req,res)=>{
    res.send({status:"success",message:"Registered"});
});

router.get('/registerFail',(req,res)=>{
    console.log(req.session.messages);
    res.status(400).send({status:"error",error:req.session.messages})
});

router.post('/login',
    passport.authenticate('login',{failureRedirect:'/api/sessions/loginFail', failureMessage:true}),async(req,res)=>{
    req.session.user = {
        name: req.user.name,
        role: req.user.role,
        id: req.user.id,
        email: req.user.email
    }
    return res.send({ status: "success", message: "Usuario Loguineado" });
});

router.get('/loginFail',(req,res)=>{
    console.log(req.session.messages);
    //Bloqueo de fuerza bruta
    // if(req.session.messages.length>4) return res.status(400).send({message:"BLOQUEA LOS INTENTOS YA!!!!!"})
    //Sebo quitar el boton de submit para no dejar intentar otra vez
    res.status(400).send({status:"error",error:req.session.messages});
});

router.get("/github", passport.authenticate("github"), (req, res) => {});

router.get("/githubcallback", passport.authenticate("github"), (req, res) => {
  const user = req.user;
  req.session.user = {
    id: user.id,
    name: user.first_name,
    role: user.role,
    email: user.email,
  };
  return res.redirect('/')
//   res.send({ status: "success", messages: "Logueado, con GITHUB" });
});

router.post('/restorePassword',async(req,res)=>{
    const {email, password } = req.body;
    //¿El usuario sí existe?
    const user = await userModel.findOne({email})
    if(!user) return res.status(400).send({status:"error",error:"User doesn't exist"})
    const isSamePassword = await validatePassword(password,user.password);
    if(isSamePassword) return res.status(400).send({status:"error",error:"Cannot replace password with current password"})
    //Ahora sí, actualizamos
    const newHashedPassword = await createHash(password);
    await userModel.updateOne({email},{$set:{password:newHashedPassword}});
    res.send({ status: "success", message: "Restored password" });
});

router.post("/logout", (req, res) => {
    // Destruye la sesión
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
            return res
            .status(500)
            .send({ status: "error", error: "Error al cerrar sesión" });
        }
        res.send({ status: "success", message: "Sesión cerrada correctamente" });
    });
});

router.get('/current', (req, res) => {
    try {
        const user = req.session.user;
        res.send({ status: "success", payload: user });

    } catch (error) {
        return res.send(error);
    }
});

export default router;