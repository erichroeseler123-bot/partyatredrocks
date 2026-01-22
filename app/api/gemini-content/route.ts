import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { artistName, venue } = await req.json();
    
    // Stable model to prevent server-side 500 crashes
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Write a high-energy, multi-paragraph professional concert preview for ${artistName} performing at ${venue}. Focus on their musical style and why this venue is the perfect place to see them.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Gemini Dispatch Error:", error);
    return NextResponse.json({ error: "AI Dispatch Failed" }, { status: 500 });
  }
}
