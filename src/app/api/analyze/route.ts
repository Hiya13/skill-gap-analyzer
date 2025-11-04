import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userSkills, target } = await req.json();

    if (!userSkills || !target) {
      return NextResponse.json(
        { error: "Missing required fields: userSkills or target" },
        { status: 400 }
      );
    }

    const skillList = Array.isArray(userSkills)
      ? userSkills.join(", ")
      : userSkills;

    const prompt = `
You are a career coach.
The user currently has these skills: ${skillList}.
They want to apply for "${target}".
List 5–8 missing or important additional skills they should learn.
Just return the skill names separated by commas, no explanations.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const missingSkills = text
      .split(/,|\n|-/)
      .map((s) => s.trim())
      .filter((s) => s && s.length < 50);

    return NextResponse.json({ missingSkills });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
