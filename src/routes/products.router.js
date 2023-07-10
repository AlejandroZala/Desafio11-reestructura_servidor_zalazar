import { Router } from "express";
// import ProductManager from "../dao/fileSystem/Managers/productManager.js";
import ProductManager from "../dao/mongo/Managers/productManager.js";

const router = Router();
const productsService = new ProductManager();

router.get('/', async (req, res) => {
  const limit = req.query.limit;
  const products = await productsService.getProducts();
  if (limit) {
    const limitProducts = products.slice(0, limit);
    res.send({ status: 'success', payload: limitProducts });
  } else {
    res.send({ status: 'success', payload: products });
  }
});
router.post('/', async (req, res) => {
  try {
    const { title, description, category, price, thumbnail, code, stock, status } = req.body;
    if(!title||!description||!category||!price||!thumbnail||!code||!stock||!status) 
      return res.status(400).send({status:"error",error:"Incomplete Values"});
    const products = await productsService.getProducts();
    const repetCode = products.find((p) => p.code === code);
    if (repetCode) {
        console.log("Code ya existente");
        return null;
    }
    const product = { title, description, category, price, thumbnail, code, stock, status }
    await productsService.createProduct(product);
    const newProducts = await productsService.getProducts();
    req.io.emit('products', newProducts);
    res.sendStatus(201)
  } catch (error) {
    console.log(error);
  }
;
});
router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await productsService.getProductBy({ _id: pid });
  if (!product)
    return res.status(404).send({ status: 'error', error: 'Product not found' });
  res.send({ status: 'success', payload: product });
});
router.put('/:pid', async(req,res)=>{
  const {pid} = req.params;
  const updateProduct = req.body;
  await productsService.updateProduct(pid,updateProduct);
  const products = await productsService.getProducts();
  req.io.emit('products', products);
  res.sendStatus(201);
})
router.delete('/:pid',async(req,res)=>{
  const {pid} = req.params;
  await productsService.deleteProduct(pid);
  const products = await productsService.getProducts();
  req.io.emit('products', products);
  res.sendStatus(201);
})

////----ROUTERS PARA USAR CON MANAGERS DE FILESYSTEM---------////

// const manager = new ProductManager();
// const products = manager.getProducts();

// router.get("/", async (req, res) => {
//   const limit = req.query.limit;
//   const allProducts = await products;
//   if (limit) {
//     const limitProduct = allProducts.slice(0, limit);
//     res.json(limitProduct);
//   } else {
//     res.json(allProducts);
//   }
// });

// router.get(`/:pid`, async (req, res) => {
//   const idProducts = req.params.pid;
//   const allProducts = await products;
//   const selected = allProducts.find((p) => p.id == idProducts);
//   res.send(selected);
// });

// router.post("/", async (req, res) => {
//   try {
//     const newProduct = req.body;
//     await manager.addProduct(newProduct);
//     const products = await manager.getProducts();
//     req.io.emit('products', products);
//     res.send({ status: "succes", message: "product posted" });
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.delete("/:pId", async (req, res) => {
//   const products_ = await products;
//   const id = req.params.pId;
//   const productIndex = products_.findIndex((p) => p.id == id);
//   if (productIndex === -1) {
//     return res
//       .status(404)
//       .send({ status: "error", error: "Product not found" });
//   }
//   products_.splice(productIndex, 1);
//   manager.deleteProduct(products_);
//   req.io.emit('products', products_);
//   res.send({ status: "succes", message: "product deleted" });
// });

// router.put(`/:pId`, async (req, res) => {
//   const allProducts = await products;
//   const id = req.params.pId;
//   const newContent = req.body;
//   const productIndex = allProducts.findIndex((p) => p.id == id);
//   if (productIndex === -1) {
//     return res
//       .status(404)
//       .send({ status: "error", error: "Product not found" });
//   }
//   allProducts[productIndex] = newContent;
//   manager.updateProduct(id, newContent);
//   res.send({ status: "succes", message: "Product updated" });
// });

export default router;
