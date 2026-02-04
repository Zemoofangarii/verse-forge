-- Add XP and level to profiles
ALTER TABLE public.profiles
ADD COLUMN xp INTEGER NOT NULL DEFAULT 0,
ADD COLUMN level INTEGER NOT NULL DEFAULT 1;

-- Create player inventory table for weapons and loot
CREATE TABLE public.player_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'weapon', 'armor', 'consumable'
  item_name TEXT NOT NULL,
  item_data JSONB DEFAULT '{}',
  equipped BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.player_inventory ENABLE ROW LEVEL SECURITY;

-- RLS policies for inventory
CREATE POLICY "Users can view their own inventory"
ON public.player_inventory
FOR SELECT
USING (profile_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can insert into their inventory"
ON public.player_inventory
FOR INSERT
WITH CHECK (profile_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update their inventory"
ON public.player_inventory
FOR UPDATE
USING (profile_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can delete from their inventory"
ON public.player_inventory
FOR DELETE
USING (profile_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
));