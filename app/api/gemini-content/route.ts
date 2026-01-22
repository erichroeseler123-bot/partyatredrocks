import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { artistName, venue } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Write a high-energy, multi-paragraph professional concert preview for ${artistName} performing at ${venue}. Focus on their musical style and why this venue is the perfect place to see them.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return NextResponse.json({ content: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "AI Generation Failed" }, { status: 500 });
  }
}
