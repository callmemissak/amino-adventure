-- Researcher Directory Table
-- Add this to your Supabase SQL Editor to create the researchers table

CREATE TABLE researchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  institution TEXT,
  expertise TEXT[], -- Array of expertise areas
  pubmed_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample data
INSERT INTO researchers (name, specialty, institution, expertise, pubmed_url, notes) VALUES
  ('Dr. Vladimir Seiwerth', 'Peptide Healing & Regeneration', 'University of Zagreb, Croatia', ARRAY['BPC-157', 'Tissue Repair', 'GI Protection'], 'https://pubmed.ncbi.nlm.nih.gov/?term=Seiwerth', 'Leading researcher on BPC-157 and its healing mechanisms'),
  ('Dr. David Young', 'Thymosin Research & Immunology', 'Weill Cornell Medicine', ARRAY['Thymosin Beta-4', 'Immunity', 'Cell Migration'], 'https://pubmed.ncbi.nlm.nih.gov/?term=David+Young+thymosin', 'Pioneer in thymosin beta-4 research and its cellular effects'),
  ('Dr. Bruce Ames', 'Peptide Research & Aging', 'UC Berkeley', ARRAY['Aging', 'Mitochondrial Function', 'Longevity'], 'https://pubmed.ncbi.nlm.nih.gov/?term=Bruce+Ames', 'Renowned researcher on cellular aging and peptide interventions');

-- Public access (no auth needed to read)
ALTER TABLE researchers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Researchers are public" ON researchers FOR SELECT USING (true);
