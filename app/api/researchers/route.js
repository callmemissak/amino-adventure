import { createServerClient } from "@/lib/supabase";

export async function GET(request) {
  try {
    const supabase = createServerClient();

    if (!supabase) {
      return Response.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("researchers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return Response.json(data || []);
  } catch (error) {
    console.error("Error fetching researchers:", error);
    return Response.json(
      { error: error.message || "Failed to fetch researchers" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const supabase = createServerClient();

    if (!supabase) {
      return Response.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    // Verify authorization (you may want to add admin auth check)
    const body = await request.json();

    const { data, error } = await supabase
      .from("researchers")
      .insert([body])
      .select();

    if (error) throw error;

    return Response.json(data[0], { status: 201 });
  } catch (error) {
    console.error("Error creating researcher:", error);
    return Response.json(
      { error: error.message || "Failed to create researcher" },
      { status: 500 }
    );
  }
}
