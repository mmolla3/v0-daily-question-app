-- ============================================================
-- Innerlog - Supabase Migration Script
-- Daily Reflection App
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES TABLE
-- Stores user preferences and stats (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'self-reflection'
    CHECK (category IN ('self-reflection', 'mental-health', 'career', 'emotional-awareness', 'mix')),
  questions_per_day INTEGER NOT NULL DEFAULT 2
    CHECK (questions_per_day BETWEEN 1 AND 3),
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_answered INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. DAILY ENTRIES TABLE
-- One entry per user per day
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood TEXT NOT NULL
    CHECK (mood IN ('happy', 'calm', 'neutral', 'anxious', 'stressed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Ensure one entry per user per day
  UNIQUE (user_id, entry_date)
);

-- Index for fast lookups by user and date
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_date
  ON daily_entries (user_id, entry_date DESC);

-- ============================================================
-- 3. RESPONSES TABLE
-- Individual question/answer pairs within a daily entry
-- ============================================================
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id UUID NOT NULL REFERENCES daily_entries(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL DEFAULT 1
    CHECK (question_order BETWEEN 1 AND 3),
  question_text TEXT NOT NULL,
  answer_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups by entry
CREATE INDEX IF NOT EXISTS idx_responses_entry
  ON responses (entry_id, question_order);

-- ============================================================
-- 4. QUESTIONS TABLE
-- Pre-defined question pool organized by category
-- ============================================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL
    CHECK (category IN ('self-reflection', 'mental-health', 'career', 'emotional-awareness', 'mix')),
  question_text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups by category
CREATE INDEX IF NOT EXISTS idx_questions_category
  ON questions (category, is_active);

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Daily entries: Users can only access their own entries
CREATE POLICY "Users can view own entries"
  ON daily_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries"
  ON daily_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON daily_entries FOR UPDATE
  USING (auth.uid() = user_id);

-- Responses: Users can only access responses tied to their entries
CREATE POLICY "Users can view own responses"
  ON responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM daily_entries
      WHERE daily_entries.id = responses.entry_id
      AND daily_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own responses"
  ON responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_entries
      WHERE daily_entries.id = responses.entry_id
      AND daily_entries.user_id = auth.uid()
    )
  );

-- Questions: Everyone can read questions
CREATE POLICY "Anyone can view active questions"
  ON questions FOR SELECT
  USING (is_active = true);

-- ============================================================
-- 6. FUNCTIONS
-- ============================================================

-- Auto-update the updated_at timestamp on profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to calculate and update user streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  streak INTEGER := 0;
  check_date DATE := CURRENT_DATE;
  entry_exists BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM daily_entries
      WHERE user_id = p_user_id AND entry_date = check_date
    ) INTO entry_exists;

    IF entry_exists THEN
      streak := streak + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;

  UPDATE profiles
  SET
    current_streak = streak,
    longest_streak = GREATEST(longest_streak, streak)
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a profile on user signup (trigger from auth.users)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 7. SEED DATA - Question Pool
-- ============================================================

INSERT INTO questions (category, question_text) VALUES
  -- Self-Reflection
  ('self-reflection', 'What gave you energy today?'),
  ('self-reflection', 'What drained your energy today?'),
  ('self-reflection', 'What is one thing you learned about yourself recently?'),
  ('self-reflection', 'What are you most grateful for right now?'),
  ('self-reflection', 'What would you tell your younger self today?'),
  ('self-reflection', 'What boundary do you need to set or reinforce?'),
  ('self-reflection', 'What is something you did today that aligned with your values?'),
  ('self-reflection', 'What made you feel proud this week?'),
  ('self-reflection', 'What is one thing you want to let go of?'),
  ('self-reflection', 'How did you show up for yourself today?'),

  -- Mental Health
  ('mental-health', 'What has been on your mind the most lately?'),
  ('mental-health', 'What emotion did you feel the strongest today?'),
  ('mental-health', 'What is one thing you can do to take care of yourself right now?'),
  ('mental-health', 'How did you manage stress today?'),
  ('mental-health', 'What is something that brought you peace today?'),
  ('mental-health', 'What thought pattern have you noticed recurring?'),
  ('mental-health', 'How are you really feeling right now, honestly?'),
  ('mental-health', 'What is one small step you can take for your wellbeing?'),
  ('mental-health', 'Who or what made you feel safe today?'),
  ('mental-health', 'What do you need more of in your life right now?'),

  -- Career & Ambition
  ('career', 'Did today move you closer to your goals?'),
  ('career', 'What is one professional skill you want to develop?'),
  ('career', 'What challenge at work taught you something?'),
  ('career', 'What would your ideal workday look like?'),
  ('career', 'What accomplishment are you overlooking?'),
  ('career', 'What is one risk worth taking in your career?'),
  ('career', 'Who inspires your professional growth?'),
  ('career', 'What would you do if failure was not an option?'),
  ('career', 'What is draining you at work and how can you change it?'),
  ('career', 'What value do you bring that nobody else does?'),

  -- Emotional Awareness
  ('emotional-awareness', 'What emotion are you carrying right now?'),
  ('emotional-awareness', 'When did you feel the most at ease today?'),
  ('emotional-awareness', 'What triggered a strong reaction in you recently?'),
  ('emotional-awareness', 'How do you typically respond when you feel overwhelmed?'),
  ('emotional-awareness', 'What emotion do you tend to avoid?'),
  ('emotional-awareness', 'What makes you feel truly understood?'),
  ('emotional-awareness', 'How did you express your feelings today?'),
  ('emotional-awareness', 'What emotion surprised you today?'),
  ('emotional-awareness', 'What do you need emotionally right now?'),
  ('emotional-awareness', 'When did you last feel completely present?'),

  -- Mix
  ('mix', 'What gave you energy today?'),
  ('mix', 'What has been on your mind the most lately?'),
  ('mix', 'Did today move you closer to your goals?'),
  ('mix', 'What emotion are you carrying right now?'),
  ('mix', 'What made you feel proud this week?'),
  ('mix', 'How are you really feeling right now, honestly?'),
  ('mix', 'What would you do if failure was not an option?'),
  ('mix', 'What do you need emotionally right now?'),
  ('mix', 'What is one thing you learned about yourself recently?'),
  ('mix', 'What is something that brought you peace today?');
