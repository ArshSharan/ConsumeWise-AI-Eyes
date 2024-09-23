import mongoose from "mongoose";

const responseSchema = mongoose.Schema({

  productEAN: {
    type: String,
    required: true,
    unique: true,
  },

  verdict: {
    type: String,
    required: true
  },

  response: {
    type: String,
    required: true,
  }
})

const Response = mongoose.model("response", responseSchema);

export default Response
