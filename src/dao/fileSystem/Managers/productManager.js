import fs from 'fs';

export default class ProductManager {
  constructor() {
    this.path = "./products.json";
    this.last_id = 1;
  }
  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        const cart = JSON.parse(data);
        return cart;
      }
      return this.products;
    } catch (error) {
      console.log(error);
    }
  }
  getProductById = async (_id) => {
    const data = await fs.promises.readFile(this.path, 'utf-8');
    const cart = JSON.parse(data);
    const product = cart.find(p => p.id === _id);
    if (product) {
      return product;
    } else {
      console.error("Not found");
      return null;
    }
  }
  //Actualiza producto según id ingresado (colocar todos los campos)
  updateProduct = async (id, elem) => {
    console.log(id, elem);
    try {
      const products = await this.getProducts();
      const newProduct = products.map((p) =>
        p.id == id ? { ...p, ...elem }:p
      );
      fs.promises.writeFile(this.path, JSON.stringify(newProduct, null, "\t"));
    } catch (error) {
      console.log(error);
    }
  };
  deleteProduct = async (products_) => {
    fs.promises.writeFile(this.path, JSON.stringify(products_, null, "\t"));
  };
  addProduct = async({title,description,category,price,thumbnail,code,stock,status})=>{
    try {
      const products = await this.getProducts();
      const product = {title,description,category,price,thumbnail,code,stock,status};
      if (
        (!title,!description,!category,!price,!thumbnail,!code,!stock,!status)
      ) {
        console.log("Datos ingresados incompletos");
        return null;
      }
      const repetCode = products.find((p) => p.code === code);
      if (repetCode) {
        console.log("Code ya existente");
        return null;
      }

      if (products.length === 0) {
        product.id = 1;
      } else {
        product.id = products[products.length - 1].id + 1;
      }
      products.push(product);

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
      return product;
    } catch (error) {
      console.log(error);
    }
  }
}