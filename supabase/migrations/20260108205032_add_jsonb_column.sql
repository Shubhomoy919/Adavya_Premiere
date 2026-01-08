-- 1. Add the JSONB column to the existing students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS game_stats JSONB NOT NULL DEFAULT '{
    "plank_challenge": 0,
    "flour_passing": 0,
    "lucky_number": 0,
    "cup_pyramid": 0,
    "carrom": 0,
    "bindi_game": 0,
    "dumbell_hold": 0
}';


-- 3. Ensure Realtime is enabled for the existing students table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'students'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
  END IF;
END $$;