-- Add coins/balance to player profiles
ALTER TABLE public.profiles ADD COLUMN coins INTEGER NOT NULL DEFAULT 1000;

-- Create property types table
CREATE TABLE public.property_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price INTEGER NOT NULL,
  icon TEXT NOT NULL DEFAULT 'building',
  model_type TEXT NOT NULL DEFAULT 'house',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on property_types (public read)
ALTER TABLE public.property_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view property types"
ON public.property_types FOR SELECT USING (true);

-- Create properties table (actual purchasable items)
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_type_id UUID REFERENCES public.property_types(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  position_x DOUBLE PRECISION NOT NULL DEFAULT 0,
  position_y DOUBLE PRECISION NOT NULL DEFAULT 0,
  position_z DOUBLE PRECISION NOT NULL DEFAULT 0,
  is_for_sale BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Anyone can view properties
CREATE POLICY "Anyone can view properties"
ON public.properties FOR SELECT USING (true);

-- Users can update their own properties (for selling)
CREATE POLICY "Owners can update their properties"
ON public.properties FOR UPDATE 
USING (owner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Create marketplace listings table
CREATE TABLE public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  asking_price INTEGER NOT NULL,
  listed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS on marketplace_listings
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active listings
CREATE POLICY "Anyone can view active listings"
ON public.marketplace_listings FOR SELECT USING (is_active = true);

-- Users can create listings for their own properties
CREATE POLICY "Owners can list their properties"
ON public.marketplace_listings FOR INSERT 
WITH CHECK (seller_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Users can update/cancel their own listings
CREATE POLICY "Sellers can update their listings"
ON public.marketplace_listings FOR UPDATE 
USING (seller_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Users can delete their own listings
CREATE POLICY "Sellers can delete their listings"
ON public.marketplace_listings FOR DELETE 
USING (seller_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Create transaction history table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'coins_earned')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions"
ON public.transactions FOR SELECT 
USING (
  buyer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  seller_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Users can insert their own transactions (when buying)
CREATE POLICY "Users can create transactions"
ON public.transactions FOR INSERT 
WITH CHECK (buyer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Enable realtime for properties and marketplace
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_listings;

-- Seed initial property types
INSERT INTO public.property_types (name, description, base_price, icon, model_type) VALUES
('Cozy Cottage', 'A small starter home for new players', 500, 'home', 'cottage'),
('Modern Loft', 'Sleek urban living space', 1500, 'building', 'loft'),
('Cyber Tower', 'High-tech futuristic tower', 3000, 'building-2', 'tower'),
('Neon Shop', 'Perfect for running your virtual business', 2000, 'store', 'shop'),
('Crystal Palace', 'Luxurious estate for the wealthy', 10000, 'castle', 'palace');

-- Seed some initial properties for sale
INSERT INTO public.properties (property_type_id, name, description, price, position_x, position_y, position_z, is_for_sale)
SELECT 
  pt.id,
  pt.name || ' #1',
  pt.description,
  pt.base_price,
  (random() * 40 - 20)::double precision,
  0.5,
  (random() * 40 - 20)::double precision,
  true
FROM public.property_types pt;

INSERT INTO public.properties (property_type_id, name, description, price, position_x, position_y, position_z, is_for_sale)
SELECT 
  pt.id,
  pt.name || ' #2',
  pt.description,
  pt.base_price + 200,
  (random() * 40 - 20)::double precision,
  0.5,
  (random() * 40 - 20)::double precision,
  true
FROM public.property_types pt;