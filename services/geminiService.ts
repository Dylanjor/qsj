import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

// Initialize Gemini Client
// Note: API Key is injected via process.env.API_KEY environment variable automatically.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RECIPE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "食谱名称，例如：'凉拌鸡胸肉丝'" },
      description: { type: Type.STRING, description: "简短的描述，吸引人且突出健康特点" },
      calories: { type: Type.INTEGER, description: "每份的大致卡路里" },
      timeMinutes: { type: Type.INTEGER, description: "烹饪所需分钟数" },
      difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
      tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "标签，例如：低卡, 高蛋白, 快手" },
      ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "食材列表，包含用量" },
      steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "详细的烹饪步骤" },
      macros: {
        type: Type.OBJECT,
        properties: {
          protein: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
        },
        required: ["protein", "fat", "carbs"]
      }
    },
    required: ["title", "description", "calories", "timeMinutes", "difficulty", "ingredients", "steps", "macros", "tags"]
  }
};

export const generateRecipes = async (categoryQuery: string): Promise<Recipe[]> => {
  try {
    const prompt = `
      你是一位专业的中国营养师和厨师。请为中国当代青年设计5道符合"${categoryQuery}"主题的健康食谱。
      
      要求：
      1. 食材在中国市场容易买到。
      2. 做法适合家庭或宿舍小功率厨具。
      3. 口味符合中国年轻人的喜好（如：低脂麻辣、酸爽、清淡等）。
      4. 严格控制热量，并提供营养元素估算。
      5. 输出结果必须是严格的JSON数组格式。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RECIPE_SCHEMA,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) return [];

    const rawRecipes = JSON.parse(text);

    // Add unique IDs and placeholder images
    return rawRecipes.map((recipe: any, index: number) => ({
      ...recipe,
      id: `${Date.now()}-${index}`,
      category: categoryQuery,
      // Use Picsum with a seed to keep images consistent for the same 'id' if persisted
      imageUrl: `https://picsum.photos/seed/${recipe.title.length + recipe.calories}/600/400`
    }));

  } catch (error) {
    console.error("Error generating recipes:", error);
    return [];
  }
};
