import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Ensure your GEMINI_API_KEY is set in Vercel Project Settings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { artistName, venue } = await req.json();
    
    // Using 'gemini-1.5-flash' for faster, more stable production responses
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Write a professional, high-energy concert preview for ${artistName} at ${venue}. Focus on their vibe and the Colorado concert experience. Keep it to 2 paragraphs.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Gemini Dispatch Error:", error);
    return NextResponse.json({ error: "AI Dispatch Failed" }, { status: 500 });
  }
}
