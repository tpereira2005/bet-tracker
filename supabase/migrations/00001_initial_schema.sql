-- ──────────────────────────────────────────────
-- BetTracker — Initial Database Schema
-- Supabase (PostgreSQL 15)
-- ──────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users (extends auth.users) ──
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  preferred_locale TEXT NOT NULL DEFAULT 'pt',
  preferred_theme TEXT NOT NULL DEFAULT 'dark',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (id = auth.uid());

-- ── Profiles ──
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_owner" ON public.profiles
  FOR ALL USING (user_id = auth.uid());

-- ── Platforms ──
CREATE TABLE IF NOT EXISTS public.platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  parser_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default platform
INSERT INTO public.platforms (name, slug, parser_config) VALUES
  ('Betano', 'betano', '{"delimiter": ";", "headers": {"date": "Date", "type": "Tipe", "value": "Vaule"}}')
ON CONFLICT (slug) DO NOTHING;

-- Platforms are public/read-only for all users
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "platforms_read_all" ON public.platforms
  FOR SELECT USING (true);

-- ── Transactions ──
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform_id UUID REFERENCES public.platforms(id) ON DELETE SET NULL,
  transaction_date DATE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('Deposit', 'Withdrawal')),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  raw_line TEXT,
  import_batch_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_profile_date ON public.transactions(profile_id, transaction_date);
CREATE INDEX idx_transactions_profile_type ON public.transactions(profile_id, transaction_type);
CREATE INDEX idx_transactions_batch ON public.transactions(import_batch_id);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_owner" ON public.transactions
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- ── Goals ──
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('net_result', 'roi', 'deposit_limit', 'streak')),
  target_value NUMERIC(12, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_goals_profile ON public.goals(profile_id);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "goals_owner" ON public.goals
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- ── Shared Reports ──
CREATE TABLE IF NOT EXISTS public.shared_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  report_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shared_reports_slug ON public.shared_reports(slug);
CREATE INDEX idx_shared_reports_user ON public.shared_reports(user_id);

ALTER TABLE public.shared_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_owner" ON public.shared_reports
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "reports_public_read" ON public.shared_reports
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- ── Auto-create user record on signup ──
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);

  -- Create default profile
  INSERT INTO public.profiles (user_id, name, is_default)
  VALUES (NEW.id, 'Principal', true);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Updated_at trigger ──
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
