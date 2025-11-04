import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, skills } = body;

    // 1️⃣ Check if user exists by name
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("name", name)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    // 2️⃣ If user exists → login
    if (existingUser) {
      return NextResponse.json({ user: existingUser, isNew: false });
    }

    // 3️⃣ If no user found and email/skills not provided → ask frontend to show signup
    if (!email || !skills) {
      return NextResponse.json(
        { error: "signup: Please provide email and skills to sign up" },
        { status: 400 }
      );
    }

    const skillsArray = typeof skills === "string"
  ? skills.split(",").map((s) => s.trim())
  : skills;

const { data: newUser, error: insertError } = await supabase
  .from("users")
  .insert([{ name, email, skills: skillsArray }])
  .select()
  .single();


    if (insertError) throw insertError;

    return NextResponse.json({ user: newUser, isNew: true });
  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
