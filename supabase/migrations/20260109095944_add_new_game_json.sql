ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS game_stats JSONB NOT NULL DEFAULT '{
    "bottle_flip": 0
}';