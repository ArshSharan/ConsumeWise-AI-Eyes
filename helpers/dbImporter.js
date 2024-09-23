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

function watch(ms) {
  if (count <= 0)
    endJob();
  setTimeout(watch, 2 * ms)
}

function endJob() {
  console.log("Import Complete")
  process.exit()
}

function objectParse(field) {
  if (field) {
    return field.join(" ").replace(/en:/g, '');
  }
  return null;
}

async function processDoc(num = 0) {
  const doc = await DocImport.findOne().skip(num)
  // if (doc.lang != "en")
  //   console.log("TETS")
  //
  if (!doc.product_name || !doc.code || !doc.nutriments) {
    logger.info(`Not writable ${doc.product_name} ${doc.code}`)
    return;
  }

  const newproduct = new Product({
    productEAN: doc.code,
    productName: doc.product_name,
    brand: doc.brands || doc.brandOwner || "unknown",
    servingSize: doc.serving_size || "unknown",
    productQty: doc.quantity || "unknown",
    description: doc.product_name,
    ingredients: doc.nutriments || {},
    createdAt: Date.now()
  })

  addField(newproduct, doc.ingredients_text_with_allergens_en);
  addField(newproduct, doc.generic_name_en);
  addField(newproduct, doc.categories_imported);
  // addField(newproduct, doc.nutrition_data);
  addField(newproduct, `Nutrition grade: ${doc.nutrition_grades}`);
  addField(newproduct, objectParse(doc.ingredients_analysis_tags));
  addField(newproduct, objectParse(doc.categories_tags));
  addField(newproduct, objectParse(doc._keywords));
  await newproduct.save()
}

let count = await DocImport.countDocuments({})
let count_cpy = count
console.log(`Parsing ${count} documents`);

for (let i = 0; i < count_cpy; i++) {
  processDoc(i).catch(err => logger.error(err)).finally(() => count--)
}
console.log("All Jobs dispatched")

watch(5000)

