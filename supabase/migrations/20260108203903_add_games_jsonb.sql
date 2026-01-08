-- 1. Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_no TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Create students table with JSONB game_stats
CREATE TABLE IF NOT EXISTS public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_no TEXT NOT NULL UNIQUE,
  name TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  game_stats JSONB NOT NULL DEFAULT '{
    "plank_challenge": 0,
    "flour_passing": 0,
    "lucky_number": 0,
    "cup_pyramid": 0,
    "carrom": 0,
    "bindi_game": 0,
    "dumbell_hold": 0
  }',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Enable Security & Realtime
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for admin app" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for admin app" ON public.admins FOR ALL USING (true) WITH CHECK (true);

-- Check if table is already in publication before adding
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'students'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
  END IF;
END $$;

-- 4. Automatic Updated_At Trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();