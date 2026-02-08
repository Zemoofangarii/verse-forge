
-- Atomic purchase property function
CREATE OR REPLACE FUNCTION public.purchase_property(
  p_property_id UUID,
  p_buyer_profile_id UUID,
  p_expected_price INTEGER
) RETURNS JSONB AS $$
DECLARE
  v_buyer_coins INTEGER;
  v_property_price INTEGER;
  v_property_owner_id UUID;
  v_is_for_sale BOOLEAN;
  v_buyer_user_id UUID;
BEGIN
  -- Verify the caller owns this profile
  SELECT user_id INTO v_buyer_user_id
  FROM profiles
  WHERE id = p_buyer_profile_id;

  IF v_buyer_user_id IS NULL OR v_buyer_user_id != auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Lock and validate property
  SELECT price, owner_id, is_for_sale
  INTO v_property_price, v_property_owner_id, v_is_for_sale
  FROM properties
  WHERE id = p_property_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Property not found');
  END IF;

  IF v_property_owner_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Property already owned');
  END IF;

  IF NOT v_is_for_sale THEN
    RETURN jsonb_build_object('success', false, 'error', 'Property not for sale');
  END IF;

  IF v_property_price != p_expected_price THEN
    RETURN jsonb_build_object('success', false, 'error', 'Price mismatch');
  END IF;

  -- Lock and validate buyer funds
  SELECT coins INTO v_buyer_coins
  FROM profiles
  WHERE id = p_buyer_profile_id
  FOR UPDATE;

  IF v_buyer_coins < v_property_price THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient funds');
  END IF;

  -- Execute transaction atomically
  UPDATE properties
  SET owner_id = p_buyer_profile_id,
      is_for_sale = false,
      updated_at = now()
  WHERE id = p_property_id;

  UPDATE profiles
  SET coins = coins - v_property_price
  WHERE id = p_buyer_profile_id;

  INSERT INTO transactions (property_id, buyer_id, amount, transaction_type)
  VALUES (p_property_id, p_buyer_profile_id, v_property_price, 'purchase');

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.purchase_property TO authenticated;

-- Atomic sell property function
CREATE OR REPLACE FUNCTION public.sell_property(
  p_property_id UUID,
  p_seller_profile_id UUID,
  p_asking_price INTEGER
) RETURNS JSONB AS $$
DECLARE
  v_sale_value INTEGER;
  v_current_owner_id UUID;
  v_seller_user_id UUID;
BEGIN
  -- Verify the caller owns this profile
  SELECT user_id INTO v_seller_user_id
  FROM profiles
  WHERE id = p_seller_profile_id;

  IF v_seller_user_id IS NULL OR v_seller_user_id != auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Validate ownership with row lock
  SELECT owner_id INTO v_current_owner_id
  FROM properties
  WHERE id = p_property_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Property not found');
  END IF;

  IF v_current_owner_id IS NULL OR v_current_owner_id != p_seller_profile_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not the owner');
  END IF;

  -- Validate asking price
  IF p_asking_price <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid price');
  END IF;

  v_sale_value := floor(p_asking_price * 0.8);

  UPDATE properties
  SET owner_id = NULL,
      is_for_sale = true,
      price = p_asking_price,
      updated_at = now()
  WHERE id = p_property_id;

  UPDATE profiles
  SET coins = coins + v_sale_value
  WHERE id = p_seller_profile_id;

  INSERT INTO transactions (property_id, seller_id, amount, transaction_type)
  VALUES (p_property_id, p_seller_profile_id, v_sale_value, 'sale');

  RETURN jsonb_build_object('success', true, 'amount', v_sale_value);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.sell_property TO authenticated;

-- Atomic combat rewards function
CREATE OR REPLACE FUNCTION public.award_combat_rewards(
  p_profile_id UUID,
  p_xp_gained INTEGER,
  p_coins_gained INTEGER
) RETURNS JSONB AS $$
DECLARE
  v_current_xp INTEGER;
  v_current_level INTEGER;
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_xp_needed INTEGER;
  v_profile_user_id UUID;
BEGIN
  -- Verify the caller owns this profile
  SELECT user_id INTO v_profile_user_id
  FROM profiles
  WHERE id = p_profile_id;

  IF v_profile_user_id IS NULL OR v_profile_user_id != auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Validate inputs (prevent cheating with huge values)
  IF p_xp_gained < 0 OR p_xp_gained > 1000 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid XP value');
  END IF;

  IF p_coins_gained < 0 OR p_coins_gained > 500 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid coins value');
  END IF;

  SELECT xp, level INTO v_current_xp, v_current_level
  FROM profiles
  WHERE id = p_profile_id
  FOR UPDATE;

  v_new_xp := v_current_xp + p_xp_gained;
  v_new_level := v_current_level;

  -- Level up logic matching client calculateXpForLevel: level * 100
  v_xp_needed := v_new_level * 100;
  WHILE v_new_xp >= v_xp_needed LOOP
    v_new_xp := v_new_xp - v_xp_needed;
    v_new_level := v_new_level + 1;
    v_xp_needed := v_new_level * 100;
  END LOOP;

  UPDATE profiles
  SET xp = v_new_xp,
      level = v_new_level,
      coins = coins + p_coins_gained
  WHERE id = p_profile_id;

  RETURN jsonb_build_object(
    'success', true,
    'new_level', v_new_level,
    'new_xp', v_new_xp,
    'leveled_up', v_new_level > v_current_level
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.award_combat_rewards TO authenticated;
