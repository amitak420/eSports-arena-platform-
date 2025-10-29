/**
 * MOCK GEMINI SERVICE
 *
 * This file mocks a versatile AI assistant for a seamless,
 * API-key-free development and deployment experience. It returns
 * pre-written responses based on keywords in the prompt.
 */

const MOCK_LATENCY = 600; // ms

async function askAI(prompt: string): Promise<string> {
  console.log(`Mock AI Request for: "${prompt}"`);
  
  return new Promise(resolve => {
    setTimeout(() => {
      const lower = prompt.toLowerCase();
      if (lower.includes("summary") || lower.includes("summarize")) {
        resolve("Match tight tha 🔥 clutch play ne sabko shock kar diya!");
      } else if (lower.includes("name") || lower.includes("suggest")) {
        resolve("Arena X Clash, Battle Ka Junoon, Headshot League, GG Royale");
      } else if (lower.includes("improve") || lower.includes("tip") || lower.includes("aim")) {
         resolve("Aim improve karne ke liye, roz training ground mein 15 minute practice karo. Sensitivity aaram se find karo, copy mat karo.");
      } else if (lower.includes("landing spots")) {
        resolve("BGMI mein? Pochinki ya School for high-risk, high-reward. Safe khelna hai toh Gatka jao.");
      } else if (lower.includes("valorant agent for beginners")) {
        resolve("Beginners ke liye Sage best hai. Healing se team ko support kar sakti ho. Simple and effective!");
      } else if (lower.includes("team composition")) {
        resolve("Defense on Icebox ke liye, Killjoy for lockdown, Sova for info, and Jett for quick retakes is a solid combo. Ek Viper bhi add karlo for extra site control.");
      } else {
        resolve("AI bola: Chill bhai, fair play karo aur leaderboard pe chha jao 🏆");
      }
    }, MOCK_LATENCY);
  });
}

// FIX: Export the required functions to resolve module errors.
export const getChatbotResponse = askAI;
export const getStrategicInsight = askAI;
