import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    email: String,
    password: String,
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Carts',
    },
    role: {
        type: String,
        default: "user"
    }
},{timestamps:true})

const userModel = mongoose.model(collection, schema);

export default userModel;