import { GeminiRequestContent, GeminiResponse } from '@/types/gemini-types';

export const generateContent = async (userInput: string): Promise<GeminiResponse> => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'GEMINI_API_KEY';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  const requestBody: GeminiRequestContent = {
    contents: [{
      parts: [{
        text: `You are a research assistant specializing in helping students develop thesis and capstone project ideas.

USER REQUEST: ${userInput}

Based on this request, generate compelling titles and brief overview for their research paper or thesis.

Return your response in this exact JSON format:
[
{
"title": "A clear, academic title that accurately represents the research topic",
"briefOverview": "A 2-3 sentence overview explaining the focus and potential significance of the research"
},
{
"title": "A clear, academic title that accurately represents the research topic",
"briefOverview": "A 2-3 sentence overview explaining the focus and potential significance of the research"
}
]

Do not include any other text, explanations, or formatting in your response - only return the JSON object.`
      }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};