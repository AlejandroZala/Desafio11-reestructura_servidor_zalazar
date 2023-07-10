import mongoose from "mongoose";

const collection = "Carts";

const schema = new mongoose.Schema({
    products: {
      type:[{
          product:{
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Products"
          },
          quantity:Number
        }
      ],
      default: []
    },
    },{ timestamps:{createdAt: "created_at", updatedAt: "updated_at"}}
);

//Middleware para populating al momento de hacer un find
schema.pre("find", function () {
  this.populate("products.product");
});

const cartModel = mongoose.model(collection, schema);

export default cartModel;