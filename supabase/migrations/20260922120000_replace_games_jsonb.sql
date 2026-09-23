-- Replace the previous eight carnival games with the new set.
-- game_stats holds a play count per game key; this only changes the default
-- applied to newly inserted students. Existing rows and their counts are left
-- untouched, and the app writes each key explicitly when points are added.
ALTER TABLE public.students
ALTER COLUMN game_stats SET DEFAULT '{
    "cup_pyramid": 0,
    "straw_bottle": 0,
    "balloon_cup_group": 0,
    "bullseye": 0,
    "marble_maze": 0,
    "dumbbell_challenge": 0,
    "dont_sit_together": 0,
    "balloon_race": 0
}';
