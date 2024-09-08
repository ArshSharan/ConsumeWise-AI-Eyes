import Product from "../models/product.js"
import { dataBaseReadByEan } from "../controllers/dataBaseController.js"

export async function verdictGenerate(req,res) {
  try{
     
    const product = await dataBaseReadByEan(req.body.ean);

    //Add verdictGenerateCode
    //Use fetch to send a new Request() on http://localhost:11434
    
    return res.status(200).json({
      message: "VerdictGenerated",
      verdict: console.assert(false, "REPLACE VERDICT WITH MISLEADING OR TRUE"),
      detailResponse: console.assert(false, "REPLACE detailResponse With Reponse")
    });
  }
  catch(err){
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  
}
