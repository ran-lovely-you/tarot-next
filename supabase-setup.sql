-- ============================================================
-- Supabase SQL Editor に貼り付けて実行してください
-- ============================================================

-- ユーザーのアクセス権テーブル
CREATE TABLE IF NOT EXISTS user_access (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_type               TEXT NOT NULL DEFAULT 'none',   -- 'none' | 'onetime' | 'subscription'
  access_active             BOOLEAN NOT NULL DEFAULT false,
  stripe_customer_id        TEXT,
  stripe_subscription_id    TEXT,
  stripe_subscription_status TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 鑑定履歴テーブル
CREATE TABLE IF NOT EXISTS reading_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spread_label TEXT,
  question     TEXT,
  data_json    JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reading_history_user ON reading_history(user_id);

-- RLS（行レベルセキュリティ）を有効化
ALTER TABLE user_access     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

-- user_access: 自分のデータのみ読み取り可
CREATE POLICY "自分のアクセス情報を読む" ON user_access
  FOR SELECT USING (auth.uid() = user_id);

-- reading_history: 自分のデータのみ操作可
CREATE POLICY "自分の履歴を読む" ON reading_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "自分の履歴を書く" ON reading_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "自分の履歴を削除" ON reading_history
  FOR DELETE USING (auth.uid() = user_id);
