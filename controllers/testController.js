import Product from "../models/product.js"
export async function testMongoDb(req, res) {
  try {

    let product = await Product.findOne({ productEAN: "1" });
    if (product) {
      return res.status(200).json({
        message: "Product Exists in DB, test 2 Successfull",
        product: product
      })
    }

    product = new Product({
      productName: "Chemicalsss",
      productEAN: "1",
      description: "Very Bad for you do not consume",
      ingredients: {
        "water": 100.23,
        "air": 10.23,
      },
    })
    await product.save();
    return res.status(200).json({
      message: "Product Added to DB, test 1 Successfull",
      product: product
    })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" })
  }

}
