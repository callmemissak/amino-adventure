import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Types for peptide updates
interface PeptideUpdate {
  peptide_name: string;
  dose?: string;
  unit?: string;
  frequency?: string;
  category?: string;
  mechanism_of_action?: string;
  research_applications?: string;
  typical_dosage_range?: string;
  half_life?: string;
  administration_method?: string;
  pubmed_links?: string;
}

interface ParsedEmail {
  subject: string;
  from: string;
  date: string;
  peptideUpdates: PeptideUpdate[];
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Parse peptide template from email body
function parsePeptideTemplate(content: string): PeptideUpdate[] {
  const updates: PeptideUpdate[] = [];
  const peptidePattern =
    /## Peptide:\s*(.+?)(?=##|$)/gis;

  let match;
  while ((match = peptidePattern.exec(content)) !== null) {
    const block = match[1];
    const update: PeptideUpdate = {
      peptide_name: "",
    };

    // Extract each field
    const nameMatch = block.match(/name:\s*(.+?)(?:\n|$)/i);
    if (nameMatch) update.peptide_name = nameMatch[1].trim();

    const doseMatch = block.match(/dose:\s*(.+?)(?:\n|$)/i);
    if (doseMatch) update.dose = doseMatch[1].trim();

    const unitMatch = block.match(/unit:\s*(.+?)(?:\n|$)/i);
    if (unitMatch) update.unit = unitMatch[1].trim();

    const freqMatch = block.match(/frequency:\s*(.+?)(?:\n|$)/i);
    if (freqMatch) update.frequency = freqMatch[1].trim();

    const catMatch = block.match(/category:\s*(.+?)(?:\n|$)/i);
    if (catMatch) update.category = catMatch[1].trim();

    const mechMatch = block.match(/mechanism:\s*(.+?)(?:\n|$)/i);
    if (mechMatch) update.mechanism_of_action = mechMatch[1].trim();

    const appMatch = block.match(/applications:\s*(.+?)(?:\n|$)/i);
    if (appMatch) update.research_applications = appMatch[1].trim();

    const halflMatch = block.match(/half[_-]life:\s*(.+?)(?:\n|$)/i);
    if (halflMatch) update.half_life = halflMatch[1].trim();

    const adminMatch = block.match(/administration:\s*(.+?)(?:\n|$)/i);
    if (adminMatch) update.administration_method = adminMatch[1].trim();

    const pubmedMatch = block.match(/pubmed:\s*(.+?)(?:\n|$)/i);
    if (pubmedMatch) update.pubmed_links = pubmedMatch[1].trim();

    if (update.peptide_name) {
      updates.push(update);
    }
  }

  return updates;
}

// Upsert peptide into database
async function upsertPeptide(
  update: PeptideUpdate
): Promise<{ success: boolean; message: string }> {
  try {
    // Create slug from peptide name
    const slug = update.peptide_name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Prepare data
    const data: Record<string, unknown> = {
      slug,
      name: update.peptide_name,
      category: update.category || "Other",
      mechanism_of_action: update.mechanism_of_action || null,
      research_applications: update.research_applications
        ? JSON.stringify([update.research_applications])
        : null,
      typical_dosage_range: update.dose || null,
      half_life: update.half_life || null,
      administration_method: update.administration_method || null,
      pubmed_links: update.pubmed_links
        ? JSON.stringify([{ url: update.pubmed_links, title: update.peptide_name }])
        : null,
    };

    // Check if peptide exists
    const { data: existing, error: fetchError } = await supabase
      .from("peptides")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from("peptides")
        .update(data)
        .eq("slug", slug);

      if (error) throw error;

      return {
        success: true,
        message: `Updated: ${update.peptide_name}`,
      };
    } else {
      // Insert new
      const { error } = await supabase.from("peptides").insert([data]);

      if (error) throw error;

      return {
        success: true,
        message: `Created: ${update.peptide_name}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Error upserting ${update.peptide_name}: ${error.message}`,
    };
  }
}

// Main handler
serve(async (req) => {
  // Verify authorization
  const authHeader = req.headers.get("authorization");
  const expectedSecret = Deno.env.get("PEPTABASE_AUTOMATION_SECRET");

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { emailContent, subject, from, date } = body as {
      emailContent: string;
      subject: string;
      from: string;
      date: string;
    };

    if (!emailContent) {
      return Response.json(
        { error: "Missing emailContent" },
        { status: 400 }
      );
    }

    // Parse email for peptide updates
    const peptideUpdates = parsePeptideTemplate(emailContent);

    if (peptideUpdates.length === 0) {
      return Response.json(
        {
          success: true,
          message: "No peptides found in email",
          updates: [],
        }
      );
    }

    // Process each peptide update
    const results = await Promise.all(
      peptideUpdates.map((update) => upsertPeptide(update))
    );

    // Log processing result
    const { error: logError } = await supabase
      .from("peptabase_update_log")
      .insert([
        {
          email_subject: subject,
          email_from: from,
          email_date: date,
          peptides_processed: peptideUpdates.length,
          results: JSON.stringify(results),
          processed_at: new Date().toISOString(),
        },
      ]);

    if (logError) console.error("Error logging update:", logError);

    return Response.json({
      success: true,
      message: `Processed ${peptideUpdates.length} peptides`,
      updates: results,
    });
  } catch (error) {
    console.error("Error in Gmail automation:", error);
    return Response.json(
      {
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
});
