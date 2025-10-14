import { createClient } from '@supabase/supabase-js';



const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET — fetch all users
export async function GET() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { status: 200 });
}

// POST — add a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, skills } = body;

    if (!name || !email)
      return new Response(JSON.stringify({ error: 'Name and email are required' }), { status: 400 });

    // Convert comma-separated string to array
    const skillsArray = skills ? skills.split(',').map(s => s.trim()) : [];

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, skills: skillsArray }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data[0]), { status: 201 });
  } catch (err: any) {
    console.error('POST route error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}


