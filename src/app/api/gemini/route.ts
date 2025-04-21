import { NextRequest, NextResponse } from "next/server";
import { GeminiResponse, GeminiRequestContent } from "@/types/gemini-types";

export async function POST(request: NextRequest) {
  try {
    // Get the API key from server-side environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    // Return error if API key is not found
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Parse the request body
    const { userInput } = await request.json();

    // Return error if userInput is missing
    if (!userInput || typeof userInput !== "string") {
      return NextResponse.json(
        { error: "Invalid request: userInput is required" },
        { status: 400 }
      );
    }

    // Prepare the request for Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody: GeminiRequestContent = {
      contents: [
        {
          parts: [
            {
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

Do not include any other text, explanations, or formatting in your response - only return the JSON object.`,
            },
          ],
        },
      ],
    };

    // Call Gemini API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: `API request failed with status: ${response.status}` },
        { status: response.status }
      );
    }

    const data: GeminiResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in Gemini API route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
