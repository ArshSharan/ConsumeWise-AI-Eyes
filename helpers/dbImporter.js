import Product from "../models/product.js"
import DocImport from "../models/docImport.js"
import connectDB from "./dbInitializer.js"
import { config } from "dotenv"
import logger from "../logs/logger.js"

config()
await connectDB();

function clip(fraction) {
  const lim = 10_000;
  if (fraction > lim) {
    return lim;
  }
  return Math.floor(fraction);
}

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

async function processDoc(num = 0, eanRegex = /.*/) {
  const doc = await DocImport.findOne({ code: { $regex: eanRegex } }).skip(num)
  if (!doc) {
    logger.info(`Product not found: matching ${eanRegex}`)
    return;
  }

  if (!doc.product_name || !doc.nutriments || Object.keys(doc.nutriments).length === 0) {
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
  addField(newProduct, listParse(doc.categories_tags));
  addField(newProduct, listParse(doc._keywords));
  await newProduct.save()
}


async function dispatch(innit = 0, count = 10_000, eanRegex) {
  const importJobs = [];
  console.log(`Parsing ${count} documents from ${innit}`);

  for (let i = innit; i < innit + count; i++) {
    importJobs.push(
      processDoc(i, eanRegex)
        .catch(err => logger.error(err))
    );
  }
  console.log("Jobs dispatched");
  await Promise.all(importJobs);

}
async function batchSplit() {

  const eanRegex = /^890/
  const countDocs = await DocImport.countDocuments({ code: { $regex: eanRegex } });
  const processFraction = clip(countDocs / 10);
  console.log(`${countDocs} Valid documents mathcing ean code`);
  for (let i = 0; i <= countDocs; i += processFraction) {
    await dispatch(i, processFraction, eanRegex);
  }
  endImport()
}

batchSplit();
