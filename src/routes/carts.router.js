import { Router } from "express";
import CartManager from "../dao/mongo/Managers/cartManager.js";

const router = Router();
const cartManager = new CartManager();

// Obtengo todos los carritos
router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.send({ status: 'success', payload: carts });
  } catch (error) {
    console.log(err)
  }
});

// Obtengo carrito por ID
router.get(`/:cid`, async (req, res) => {
  try {
    const  cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);

   // console.log(JSON.stringify(cart, null, '\t'))
    res.send({status: 'success', payload: cart})
  } catch (err) {
    console.log(err);
    return res.status(404).send({ status: "error", error: "Cart not found" });
  }
});
// Creo nuevo carrito
router.post(`/`, async (req, res) => {
  try {
    cartManager.createCart();
    res.send("Cart created");
  } catch (error) {
    console.log(error);
    return res.status(404).send({ status: "error", error: "Cart not created" });
  }
});

// Agrego un producto al carrito
router.post(`/:cid/product/:pid`, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const addProductCart = await cartManager.addProductToCart(cid, pid);
    res.send({ status: "succes", payload: addProductCart });
  }
  catch(err){
    console.log(err)
  }
});

  // Elimino  producto del carrito
  router.delete('/:cid/product/:pid',async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = cartManager.deleteProductToCart(cid, pid);
      res.send({status: 'success', payload: cart})
    }
    catch(err){
      console.log(err)
    }
  });

    // Eliminar un carrito por ID
  router.delete('/:cid',async (req, res) => {
    try{
      const { cid } = req.params;
      await cartManager.deleteCart(cid);
      const cart = await cartManager.getCarts();
      req.io.emit('carts', cart);
      res.send({status: 'success', payload: cart})
    }
  catch(err){
    console.log(err)
  }
  });

    //Modifico producto en carrito
  router.put("/:cid/products/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const newQuantity = req.body;
      const updatedCart = await cartManager.updateProductInCart(
        cid,
        pid,
        newQuantity
      );
  
      res.send({ status: "success", payload: updatedCart });
    } catch (err) {
      console.log(err);
      res.status(500).send({ status: "error", error: err.message });
    }
  });

export default router;
