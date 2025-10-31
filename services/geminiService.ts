import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chatbotModel = 'gemini-2.5-flash';
const strategyModel = 'gemini-2.5-pro';

const chatbotSystemInstruction = `You are a friendly and helpful AI Gaming Coach for an Indian esports platform called "eSports Arena".
Your audience is young Indian gamers.
You MUST reply in a conversational, friendly, and encouraging tone.
You MUST use a mix of English and Hindi (Hinglish), just like how friends talk. For example: "Tension mat le, practice se sab theek ho jayega." or "GG! That was a great question."
Keep your answers concise and easy to understand.
Your knowledge areas are popular esports titles in India: BGMI, Valorant, Free Fire, and COD Mobile.
Do not answer questions outside of gaming strategies, tips, or tournament advice. If asked something else, politely steer the conversation back to gaming.`;

const strategySystemInstruction = `You are an expert esports strategist.
Provide clear, actionable, and detailed advice for the user's question about a specific game.
Structure your response with headings or bullet points for readability.
Your tone should be professional yet encouraging.
Assume the user has a good understanding of the game but is looking for advanced tactics.`;

export async function getChatbotResponse(prompt: string): Promise<string> {
  try {
    console.log(`AI Chatbot Request for: "${prompt}"`);
    const response = await ai.models.generateContent({
      model: chatbotModel,
      contents: prompt,
      config: {
        systemInstruction: chatbotSystemInstruction
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for chatbot:", error);
    return "Oops! Thoda technical issue ho gaya. Please try again later.";
  }
}

export async function getStrategicInsight(prompt: string): Promise<string> {
  try {
    console.log(`AI Strategy Request for: "${prompt}"`);
    const response = await ai.models.generateContent({
      model: strategyModel,
      contents: prompt,
      config: {
        systemInstruction: strategySystemInstruction,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error)
  {
    console.error("Error calling Gemini API for strategy:", error);
    return "Sorry, I'm unable to analyze that right now. Please check your query and try again.";
  }
}
