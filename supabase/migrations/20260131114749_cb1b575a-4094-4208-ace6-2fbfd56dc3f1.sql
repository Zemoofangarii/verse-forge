-- Add new avatar customization columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN avatar_hat TEXT NOT NULL DEFAULT 'none',
ADD COLUMN avatar_accessory TEXT NOT NULL DEFAULT 'none',
ADD COLUMN avatar_particle TEXT NOT NULL DEFAULT 'none';

-- Add comments for valid options
COMMENT ON COLUMN public.profiles.avatar_hat IS 'Valid values: none, crown, wizard, party, halo, horns';
COMMENT ON COLUMN public.profiles.avatar_accessory IS 'Valid values: none, wings, cape, shield, aura, pet';
COMMENT ON COLUMN public.profiles.avatar_particle IS 'Valid values: none, sparkles, fire, ice, hearts, stars';