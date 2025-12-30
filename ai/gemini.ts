import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_URL || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function classifyExpense(description: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Classify this expense into one category:
    Categories: food, transport, entertainment, utilities, others

    Description: "${description}"

    Only return the category.
`;

  const result = await model.generateContent(prompt);
  const category = result.response.text().trim();

  return category;
}
