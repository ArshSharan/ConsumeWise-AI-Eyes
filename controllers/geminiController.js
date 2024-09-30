import { GoogleGenerativeAI } from "@google/generative-ai";

export async function geminiController(product) {
  try {
    const productString = JSON.stringify(product.toObject());

    // Initialize the Google Generative AI model
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    // Set the system instruction during model initialization
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `
      You are a health analyst who responds in ENGLISH, for a food company named ConsumeWise.
      
      You are given the JSON representation of the product as the input.
      
      And you are to provide the outputs in the respective order: 
      (If you find any data field with 'unknown' status,try to find its value based off your own intelligence. If not,ignore those fields and proceed further.) 
      
      1. Check if there are any claims made by brands that could be misleading. 
      
      2. The analysis can be general with relevant nudges to the user. Some pointers are:

      a. Nutritional Analysis - Higher presence of nutrients desired in low qty (fats, sugar, sodium, calories)

      b. How processed and nutrient deficit is the product?

      c. Harmful Ingredients present

      d. If people follow certain diets, does it comply with it

      e. Is it diabetes/allergen friendly. Use your intelligence, to verify whether the product is vegetarian or non - vegetarian or vegan or not.

      What to optimise for

      • Scientific credibility & accuracy of the analysis provided

      • The information should add value to the user such that helping them make a decision
      
      make the output concise and make sure to have all the subheadings provided in their respective order. It should be 
      informative to the consumer .
      `
});

    const prompt = productString;

    const result = await model.generateContent(prompt);

    return result.response.text();

  } catch (error) {
    console.error("Error:", error);
    return "Error in fetching product analysis.";
  }
}


