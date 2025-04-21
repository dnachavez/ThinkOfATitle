import { GeminiResponse } from "@/types/gemini-types";
import { TitlePaperSuggestion } from "@/types/title-suggestion";

export function parseGeminiResponse(response: GeminiResponse): TitlePaperSuggestion[] {
  try {
    if (!response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Invalid response format");
      return [];
    }

    const textContent = response.candidates[0].content.parts[0].text;

    const jsonString = textContent.replace(/```json\n|\n```|```/g, "");

    const suggestions = JSON.parse(jsonString) as TitlePaperSuggestion[];

    return suggestions;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    return [];
  }
}
