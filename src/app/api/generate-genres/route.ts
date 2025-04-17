import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCxBRotRH-KbPyY44GGuC6eneUftL5mmqE");

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json();
        console.log("User Prompt:", prompt);

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const systemPrompt = `
      You are an expert in music genres and subgenres. Generate 6 creative, unique, and plausible music genres based on the user's prompt. 
      Each genre should have a name and a brief description explaining its characteristics, influences, and style. 
      Format your response as a **valid JSON array** of objects with 'name' and 'description' properties.
    `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: `${systemPrompt}\n\nPrompt: "${prompt}"` }],
                },
            ],
        });

        const rawText = result.response.text();
        console.log("Gemini Raw Response:", rawText);

        // Clean up common Markdown artifacts
        const cleanedText = rawText
            .replace(/^```json/, "")
            .replace(/^```/, "")
            .replace(/```$/, "")
            .trim();

        let genres;
        try {
            genres = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("JSON Parsing failed:", parseError);
            return NextResponse.json(
                {
                    genres: [
                        {
                            name: "Parsing Error Genre",
                            description:
                                "The AI generated a response that couldn't be parsed as JSON. Please try again with a different prompt.",
                        },
                    ],
                },
                { status: 200 }
            );
        }

        return NextResponse.json({ genres });
    } catch (error: any) {
        console.error("Error in genre generation API:", error);
        return NextResponse.json(
            {
                error: "Failed to generate genres",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
