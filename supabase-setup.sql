CREATE TABLE IF NOT EXISTS user_access (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_type               TEXT NOT NULL DEFAULT 'none',
  access_active             BOOLEAN NOT NULL DEFAULT false,
  stripe_customer_id        TEXT,
  stripe_subscription_id    TEXT,
  stripe_subscription_status TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reading_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spread_label TEXT,
  question     TEXT,
  data_json    JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reading_history_user ON reading_history(user_id);
ALTER TABLE user_access     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own access" ON user_access FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "read own history" ON reading_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert own history" ON reading_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own history" ON reading_history FOR DELETE USING (auth.uid() = user_id);
