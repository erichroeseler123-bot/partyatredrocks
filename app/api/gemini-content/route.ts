import { GoogleGenerativeAI } from "@google/generative-ai";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { artistName, venue, showDate } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Updated prompt for multi-paragraph generation
    const prompt = `Write a professional, high-energy three-paragraph fan guide for ${artistName} at ${venue}. 
    Paragraph 1: Describe the artist's current vibe and tour energy. 
    Paragraph 2: Explain why ${venue} is the ultimate place to experience this performance. 
    Paragraph 3: Provide one essential tip for fans to make the most of the night. 
    Separate the paragraphs with clear line breaks and do not use hashtags.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Save as a JSON file in your partyatredrocks-blob store
    await put(`guides/${artistName}.json`, JSON.stringify({ text, showDate }), {
      access: 'public',
      addRandomSuffix: false
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ text: "Get ready for a legendary night at the venue!" }, { status: 500 });
  }
}
