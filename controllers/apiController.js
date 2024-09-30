import {
  dataBaseReadProductByEAN, dataBaseReadCacheByEAN, dataBaseNewCacheResponse
} from "../controllers/dataBaseController.js"
import logger from "../logs/logger.js";

import {geminiController} from "./geminiController.js"
import { marked } from "marked";
async function modelCommunicate(ean) {
  const product = await dataBaseReadProductByEAN(ean);
  if (!product)
    return {
      productEAN: ean,
      verdict: null,
      response: "Product not found"
    }
    const analysis = await geminiController(product);
    const analysisHtml = marked(analysis);

  return {
    productEAN: ean,
    verdict: true,
    response: analysisHtml
  }
}

async function respGen(ean) {

  const cachedResponse = await dataBaseReadCacheByEAN(ean);
  if (cachedResponse != null)
    return cachedResponse;

  const newResponse = await modelCommunicate(ean);
  dataBaseNewCacheResponse(newResponse)
  .then(
    ()=>logger.info(`${ean} added to db`)
  ).catch(err=>logger.error(`Failed to add ${ean} to db`));
  return newResponse;

}

export async function verdictGenerate(req, res) {
  try {
    const response = await respGen(req.query.ean);

    return res.status(response.verdict ? 200 : 404).json({
      message: "Verdict Generated",
      detailResponse: response.response
    });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
