import Product from "../models/product.js"

export async function dataBaseReadByEAN(ean) {
  try {
    const product = await Product.findOne({ productEAN: ean });

    return product;
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

}
