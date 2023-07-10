import productModel from "../models/product.js";

export default class ProductManager{

    getProducts = (params) =>{
        return productModel.find(params).lean();
    }

    getProductBy = (params) =>{
        return productModel.findOne(params).lean();
    }

    createProduct = (product) => {
        return productModel.create(product);
    };
    
    updateProduct = (id, product) => {
        return productModel.findByIdAndUpdate(id, {$set: product});
    };
    
    deleteProduct = (id) => {
        return productModel.findByIdAndDelete(id);
    };
}