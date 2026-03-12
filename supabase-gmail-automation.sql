-- Peptabase Update Logging Table
-- Add this to your Supabase SQL Editor to track Gmail automation processing

CREATE TABLE peptabase_update_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_subject TEXT,
  email_from TEXT,
  email_date TIMESTAMPTZ,
  peptides_processed INTEGER,
  results JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_peptabase_log_processed ON peptabase_update_log(processed_at DESC);
CREATE INDEX idx_peptabase_log_from ON peptabase_update_log(email_from);

-- View for recent updates
CREATE VIEW recent_peptabase_updates AS
SELECT
  id,
  email_from,
  email_subject,
  peptides_processed,
  processed_at
FROM peptabase_update_log
ORDER BY processed_at DESC
LIMIT 50;
