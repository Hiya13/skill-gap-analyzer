import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Request body:", body);
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

    const { userId, targetSkills } = body;

    if (!Array.isArray(targetSkills)) {
      return NextResponse.json(
        { error: "Invalid request. 'targetSkills' must be an array." },
        { status: 400 }
      );
    }

    let user;

    if (userId) {
      // Fetch user by UUID
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, skills")
        .eq("id", userId)
        .single();

      if (error) console.log("Supabase error:", error?.message);
      user = data;
    }

    if (!user) {
      // If userId missing or invalid, fetch first user for testing
      const { data } = await supabase
        .from("users")
        .select("id, name, email, skills")
        .limit(1)
        .single();
      user = data;
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userSkills: string[] = user.skills || [];
    const missingSkills = targetSkills.filter(
      (skill: string) => !userSkills.includes(skill)
    );

    return NextResponse.json({
      user: user.name,
      existingSkills: userSkills,
      missingSkills,
    });
  } catch (err) {
    console.error("Error in /api/analyze:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
