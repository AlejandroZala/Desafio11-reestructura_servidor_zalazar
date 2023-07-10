import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const collection = 'Products';

const schema = new mongoose.Schema({
    title:String,
    description:String,
    category:String,
    price:Number,
    thumbnail:String,
    code:String,
    stock:Number,
    status:Boolean
}, {createdAt:'create_at', updatedAt: 'update_at'}
);

schema.plugin(mongoosePaginate);
const productModel = mongoose.model(collection, schema);

export default productModel;