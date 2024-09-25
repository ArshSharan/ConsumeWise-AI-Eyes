import Product from "../models/product.js"
import Response from "../models/responseCache.js"

export async function dataBaseReadProductByEAN(ean) {
  try {
    const product = await Product.findOne({ productEAN: ean });

    return product;
  }
  catch (err) {
    console.log(err);
    return null;
  }

}

export async function dataBaseReadCacheByEAN(ean) {
  try {
    const response = await Response.findOne({ productEAN: ean });

    return response;
  }
  catch (err) {
    console.log(err);
    return null;
  }
}

export async function dataBaseNewCacheResponse(response) {
  try {
    if (!response.verdict)
      return
    const cache = new Response({
      productEAN: response.productEAN || null,
      verdict: response.verdict || null,
      response: response.response || null
    })
    await cache.save()
  }
  catch (err) {
    console.log(err);
    return null;
  }
}
