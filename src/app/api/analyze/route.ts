import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userSkills, target } = await req.json();

    if (!userSkills || !target) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const skillList = Array.isArray(userSkills)
      ? userSkills.join(", ")
      : userSkills;

    const prompt = `
You are a career coach.
The user currently has these skills: ${skillList}.
They are preparing for the company or role: "${target}".
List 5–8 missing or important additional skills they should learn.
Return only the skill names, comma-separated.
`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // You can also try: "mistralai/mixtral-8x7b"
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const output =
      data?.choices?.[0]?.message?.content?.trim() ||
      "No result from model.";

    const missingSkills = output
      .split(/,|\n|-/)
      .map((s: string) => s.trim())
      .filter(Boolean)
      .slice(0, 8);

    return NextResponse.json({ missingSkills });
  } catch (err: any) {
    console.error("OpenRouter API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
