import { GoogleGenerativeAI } from "@google/generative-ai";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { artistName, venue, showDate } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Write a high-energy 2-sentence guide for fans seeing ${artistName} at ${venue}. No hashtags.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Save as a JSON file in your existing Blob store
    await put(`guides/${artistName}.json`, JSON.stringify({ text, showDate }), {
      access: 'public',
      addRandomSuffix: false
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ text: "Get ready for a legendary night!" }, { status: 500 });
  }
}
