import { Router } from "express";
import { privacy } from "../middlewares/auth.js";
// import ProductManager from "../dao/fileSystem/Managers/productManager.js";
import ProductManager from "../dao/mongo/Managers/productManager.js";
import CartManager from "../dao/mongo/Managers/cartManager.js";
import productModel from "../dao/mongo/models/product.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/register', privacy('NO_AUTHENTICATED'), (req, res) => {
    res.render('register');
});

router.get('/login', privacy('NO_AUTHENTICATED'), (req, res) => {
    res.render('login');
});

router.get('/profile', privacy('PRIVATE'), (req, res) => {
    res.render('profile',{
        user: req.session.user
    })
});

router.get('/restorePassword',privacy('NO_AUTHENTICATED'),(req,res)=>{
    res.render('restorePassword')
})

router.get('/', privacy('PRIVATE'), async (req,res)=>{
    try {
        const { page = 1 } = req.query;
        let { limit = 5, sort = 1 } = req.query;

        if (req.query.limit) {
            req.session.limit = req.query.limit;
        } else if (req.session.limit) {
            limit = req.session.limit;
        }
        if (req.query.sort) {
            req.session.sort = req.query.sort;
        } else if (req.session.sort) {
            sort = req.session.sort;
        }

        const options = {
            page,
            limit: parseInt(limit),
            lean: true,
            sort: { price: sort }
        };
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } =
            await productModel.paginate({}, options);
        const products = docs;

        res.render('products',{
            user: req.session.user,
            products,
            page: rest.page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            css: 'products'
        });
    } catch (error) {
        res.status(500).send({status:"error", error: "Error al obtener productos"})
    }
});

router.get('/realTimeProducts', privacy('PRIVATE'), async(req,res)=>{
    const products = await productManager.getProducts();
    res.render('realTimeProducts', {products, css: 'realTimeProducts'});
});

router.get('/carts/:cid', privacy('PRIVATE'), async (req,res)=>{
    const cid = req.params.cid;
    const carts = await cartManager.getCarts();
    const cartSelected = carts.find((cart) => cart._id == cid);
    res.render('cart',{cartSelected})
});

router.get('/chat', privacy('PRIVATE'), async (req,res)=>{
    res.render('Chat')
});

export default router;