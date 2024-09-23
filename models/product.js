import mongoose from "mongoose"

const productSchema = mongoose.Schema({

  productName: {
    type: String,
    required: true,
    lowercase: true,
  },

  productEAN: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    required: false,
  },

  brand: {
    type: String,
    required: false,
  },

  productQty: {
    type: String,
    required: false
  },

  servingSize: {
    type: String,
    required: false
  },

  ingredients: {
    type: Object,
    required: false,
    default: {},
  },

  createdAt: { type: Date }

})

const Product = mongoose.model("product", productSchema);

export default Product
