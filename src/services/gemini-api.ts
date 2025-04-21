import { GeminiResponse } from "@/types/gemini-types";

export const generateContent = async (userInput: string): Promise<GeminiResponse> => {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
};
