-- Add avatar shape column to profiles
ALTER TABLE public.profiles 
ADD COLUMN avatar_shape TEXT NOT NULL DEFAULT 'capsule';

-- Add comment for valid shapes
COMMENT ON COLUMN public.profiles.avatar_shape IS 'Valid shapes: capsule, cube, sphere, robot, ninja';