import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  
  productName:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  productEAN: {
  type: String,
  required: true,
  unique: true,
  },

  description: {
  type: String,
  required: true,
  },

  ingredients: {
    type: [{ type: String }],
    required: false,
    default: [],
  },

  healthEffects: {
    type: [{ type: String }],
    required: false,
    default: [],
  },

})

const Product = mongoose.model("product", productSchema);

export default Product
