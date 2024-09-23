import {
  dataBaseReadProductByEAN, dataBaseReadCacheByEAN, dataBaseNewCacheResponse
} from "../controllers/dataBaseController.js"


async function modelCommunicate(ean) {
  const product = await dataBaseReadProductByEAN(ean);
  if (!product)
    return {
      productEAN: ean,
      verdict: null,
      response: "Product not found"
    }

  return {
    productEAN: ean,
    verdict: console.assert(false, "REPLACE THIS WITH MISLEADING OR TRUE"),
    response: console.assert(false, "REPLACE THIS WITH THE RESPONSE") //TODO: Replace this with the response from gemini
  }
}

async function respGen(ean) {

  const cachedResponse = await dataBaseReadCacheByEAN(ean);
  if (cachedResponse != null)
    return cachedResponse;

  const newResponse = await modelCommunicate(ean);
  await dataBaseNewCacheResponse(newResponse);
  return newResponse;

}

export async function verdictGenerate(req, res) {
  try {
    const response = await respGen(req.query.ean);

    return res.status(response.verdict ? 200 : 404).json({
      message: "Verdict Generated",
      verdict: response.verdict,
      detailResponse: response.response
    });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

}
