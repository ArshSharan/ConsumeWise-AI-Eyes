import Product from "../models/product.js"
import DocImport from "../models/docImport.js"
import connectDB from "./dbController.js"
import { config } from "dotenv"
import logger from "../logs/logger.js"

config()
await connectDB();

function addField(prod, field) {
  if (field)
    prod.description += '\n' + field;
}

function endImport() {
  console.log("Import Complete")
  process.exit()
}

function unknownParse(field) {
  return field
}


function objectParse(field) {
  if (!field)
    return null
  return JSON.stringify(field).replace(/[{}]/g, "");
}

function listParse(field) {
  if (!field)
    return null;
  return field.join(" ").replace(/en:/g, '');
}

function ingredientsParse(nutriments) {
  try {
    const ingredients = {}

    for (let field in nutriments) {
      const fieldSplit = field.split("_")
      const reduced_field = fieldSplit[0]
      if (fieldSplit[fieldSplit.length - 1] == "unit")
        continue
      if (reduced_field in ingredients)
        continue
      ingredients[reduced_field] = String(nutriments[field]);
      if (nutriments[reduced_field + "_unit"])
        ingredients[reduced_field] = ingredients[reduced_field] + " " + nutriments[reduced_field + "_unit"]
    }

    return ingredients
  }
  catch (err) {
    console.error(err)
  }

}

async function processDoc(num = 0) {
  const doc = await DocImport.findOne().skip(num)
  // if (doc.lang != "en")
  //   console.log("TETS")
  //
  if (!doc.product_name || !doc.code || !doc.nutriments || Object.keys(doc.nutriments).length === 0) {
    logger.info(`Not writable ${doc.product_name} ${doc.code}`)
    return;
  }

  const newProduct = new Product({
    productEAN: doc.code,
    productName: doc.product_name,
    brand: doc.brands || doc.brandOwner || "unknown",
    servingSize: doc.serving_size || "unknown",
    productQty: doc.quantity || "unknown",
    description: doc.product_name,
    ingredients: ingredientsParse(doc.nutriments),
    createdAt: Date.now()
  })

  addField(newProduct, doc.ingredients_text_with_allergens_en);
  addField(newProduct, doc.generic_name_en);
  addField(newProduct, doc.categories_imported);
  // addField(newproduct, doc.nutrition_data);
  // addField(newProduct, unknownParse(listParse(doc.ingredients_analysis_tags)));
  addField(newProduct, listParse(doc.categories_tags));
  addField(newProduct, listParse(doc._keywords));
  await newProduct.save()
}


async function dispatch() {

  const count = await DocImport.countDocuments({});
  let count_cpy = count;
  const importJobs = [];
  const moduloCheck = Math.floor(count / 10);
  console.log(`Parsing ${count} documents`);

  for (let i = 0; i < count; i++) {
    importJobs.push(
      processDoc(i)
        .catch(err => logger.error(err))
        .finally(() => {
          count_cpy--;
          if (count_cpy % moduloCheck == 0)
            console.log(`${count_cpy} Documents left`);
        })
    );
  }
  console.log("All Jobs dispatched");
  await Promise.all(importJobs);
  endImport()

}
dispatch();
