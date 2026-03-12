-- Notification Tables & Configuration
-- Add these to your Supabase SQL Editor for notification support

-- Notification Log (track all sent notifications)
CREATE TABLE notification_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  type TEXT NOT NULL, -- 'email' or 'push'
  data JSONB,
  is_test BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivery_status TEXT DEFAULT 'pending' -- 'pending', 'sent', 'failed'
);

-- Push Subscriptions (for Web Push API)
CREATE TABLE push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription JSONB NOT NULL, -- Serialized PushSubscription object
  endpoint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification Preferences (user settings)
CREATE TABLE notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email_reminders BOOLEAN DEFAULT true,
  push_reminders BOOLEAN DEFAULT true,
  reminder_time TEXT DEFAULT '09:00', -- 24-hour format HH:MM
  reminder_frequency TEXT DEFAULT 'daily', -- 'daily', 'weekly', 'never'
  digest_email BOOLEAN DEFAULT false,
  protocol_reminders BOOLEAN DEFAULT true,
  injection_reminders BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notification_log
CREATE POLICY "Users can view own notification log"
  ON notification_log FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for push_subscriptions
CREATE POLICY "Users manage own push subscriptions"
  ON push_subscriptions FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for notification_preferences
CREATE POLICY "Users manage own notification preferences"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id);

-- Create notification preferences on signup
CREATE OR REPLACE FUNCTION create_notification_prefs()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_created_notification_prefs ON auth.users;
CREATE TRIGGER on_user_created_notification_prefs
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_notification_prefs();

-- Indexes for performance
CREATE INDEX idx_notification_log_user ON notification_log(user_id);
CREATE INDEX idx_notification_log_sent_at ON notification_log(sent_at DESC);
CREATE INDEX idx_push_subscriptions_user ON push_subscriptions(user_id);
CREATE INDEX idx_notification_preferences_user ON notification_preferences(user_id);

-- View for notification statistics
CREATE VIEW notification_stats AS
SELECT
  user_id,
  COUNT(*) as total_sent,
  SUM(CASE WHEN type = 'email' THEN 1 ELSE 0 END) as emails_sent,
  SUM(CASE WHEN type = 'push' THEN 1 ELSE 0 END) as pushes_sent,
  MAX(sent_at) as last_notification
FROM notification_log
WHERE is_test = false
GROUP BY user_id;
