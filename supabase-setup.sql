-- Peptide Atlas Supabase Setup
-- Execute all statements in your Supabase SQL Editor at: https://supabase.com/dashboard/project/_/sql
-- This creates the backend database structure with audit logging and RLS policies

-- ========== CORE TABLES ==========

-- User Profiles (linked to auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory: Track peptide vials
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  peptide_name TEXT NOT NULL,
  vial_size NUMERIC,
  unit TEXT DEFAULT 'mg', -- 'mg', 'mcg'
  quantity INTEGER,
  coa_number TEXT, -- Certificate of Analysis
  purchase_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Protocols: Save research protocols and cycles
CREATE TABLE protocols (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  peptide_name TEXT NOT NULL,
  dose NUMERIC,
  unit TEXT DEFAULT 'mg', -- 'mg', 'mcg'
  frequency TEXT, -- e.g., "2x daily", "once weekly"
  start_date DATE,
  end_date DATE,
  injection_location TEXT, -- e.g., "abdomen", "shoulder"
  summary_notes TEXT, -- Notes on cycle results/effects
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Injection Log: Track individual injections
CREATE TABLE injection_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  peptide_name TEXT NOT NULL,
  dose NUMERIC,
  unit TEXT DEFAULT 'mg', -- 'mg', 'mcg'
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  location TEXT, -- Injection site
  notes TEXT, -- Side effects, observations
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== AUDIT TABLE ==========

-- Audit Log: Track all changes to user data
CREATE TABLE audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  row_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== ROW LEVEL SECURITY (RLS) ==========

-- Enable RLS on all user-data tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE injection_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/write their own
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Inventory: Users can only access their own inventory
CREATE POLICY "Users can view own inventory"
  ON inventory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
  ON inventory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory"
  ON inventory FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory"
  ON inventory FOR DELETE
  USING (auth.uid() = user_id);

-- Protocols: Users can only access their own protocols
CREATE POLICY "Users can view own protocols"
  ON protocols FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own protocols"
  ON protocols FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own protocols"
  ON protocols FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own protocols"
  ON protocols FOR DELETE
  USING (auth.uid() = user_id);

-- Injection Log: Users can only access their own log entries
CREATE POLICY "Users can view own injection log"
  ON injection_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own injection log"
  ON injection_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own injection log"
  ON injection_log FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own injection log"
  ON injection_log FOR DELETE
  USING (auth.uid() = user_id);

-- Audit Log: Users can only view their own audit trail
CREATE POLICY "Users can view own audit log"
  ON audit_log FOR SELECT
  USING (auth.uid() = changed_by);

-- ========== AUDIT TRIGGERS ==========

-- Create function to log changes
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (table_name, row_id, action, old_data, new_data, changed_by)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(OLD.id, NEW.id),
    TG_OP,
    to_jsonb(OLD),
    to_jsonb(NEW),
    auth.uid()
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for each table
CREATE TRIGGER audit_inventory
  AFTER INSERT OR UPDATE OR DELETE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION log_changes();

CREATE TRIGGER audit_protocols
  AFTER INSERT OR UPDATE OR DELETE ON protocols
  FOR EACH ROW
  EXECUTE FUNCTION log_changes();

CREATE TRIGGER audit_injection_log
  AFTER INSERT OR UPDATE OR DELETE ON injection_log
  FOR EACH ROW
  EXECUTE FUNCTION log_changes();

-- ========== INDEXES FOR PERFORMANCE ==========

-- Speed up queries by user_id
CREATE INDEX idx_inventory_user_id ON inventory(user_id);
CREATE INDEX idx_protocols_user_id ON protocols(user_id);
CREATE INDEX idx_injection_log_user_id ON injection_log(user_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(changed_by);

-- Speed up sorting by date
CREATE INDEX idx_inventory_created ON inventory(created_at DESC);
CREATE INDEX idx_protocols_created ON protocols(created_at DESC);
CREATE INDEX idx_injection_log_timestamp ON injection_log(timestamp DESC);

-- ========== AUTO-CREATE PROFILE ON SIGNUP ==========

-- Trigger to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========== REFERENCE DATA (Optional: Typical Cycles) ==========

-- Uncomment to add typical cycle data
/*
CREATE TABLE peptide_cycles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  peptide_name TEXT UNIQUE,
  typical_dose TEXT, -- e.g., "200-500 mcg/day"
  typical_cycle_weeks INTEGER,
  typical_break_weeks INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample cycle data
INSERT INTO peptide_cycles (peptide_name, typical_dose, typical_cycle_weeks, typical_break_weeks, notes) VALUES
  ('BPC-157', '200-500 mcg/day', 4, 2, 'GI support & healing'),
  ('TB-500', '2-2.5 mg 2x/weekly', 4, 2, 'Tissue repair'),
  ('Melanotan I', '50-200 mcg daily', 4, 2, 'Tanning protocol'),
  ('CJC-1295', '1-2 mg/week', 8, 4, 'GH support');
*/

-- ========== DONE ==========
-- Your backend is now ready!
-- Next steps:
-- 1. Create a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
-- 2. Run: npm install
-- 3. Update PeptideAtlas.jsx to include Auth and UserDashboard components
-- 4. Test login/signup flow
