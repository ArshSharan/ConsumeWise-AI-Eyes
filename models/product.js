import mongoose from "mongoose";

const productSchema = mongoose.Schema({

  productName: {
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

  brand: {
    type: String,
    required: false,
  },

  productQty: {
    type: Number,
    required: false
  },

  servingSize: {
    type: Number,
    required: false
  },

  ingredients: {
    type: [{
      type: {
        name: { type: String },
        amount: { type: Number, default: 0 },
      }
    }],
    required: false,
    default: [],
  },

  healthClaims: {
    type: [{ type: String }],
    required: false,
    default: [],
  },

})

const Product = mongoose.model("product", productSchema);

export default Product
