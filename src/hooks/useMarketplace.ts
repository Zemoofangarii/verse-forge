import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Property, PropertyType, MarketplaceListing } from "@/types/marketplace";
import { toast } from "sonner";

export function useMarketplace(profileId: string | null) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [coins, setCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all available properties for sale
  const fetchProperties = useCallback(async () => {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        property_type:property_types(*)
      `)
      .eq("is_for_sale", true)
      .is("owner_id", null);

    if (error) {
      console.error("Error fetching properties:", error);
      return;
    }

    setProperties(data || []);
  }, []);

  // Fetch property types
  const fetchPropertyTypes = useCallback(async () => {
    const { data, error } = await supabase
      .from("property_types")
      .select("*");

    if (error) {
      console.error("Error fetching property types:", error);
      return;
    }

    setPropertyTypes(data || []);
  }, []);

  // Fetch user's owned properties
  const fetchMyProperties = useCallback(async () => {
    if (!profileId) return;

    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        property_type:property_types(*)
      `)
      .eq("owner_id", profileId);

    if (error) {
      console.error("Error fetching my properties:", error);
      return;
    }

    setMyProperties(data || []);
  }, [profileId]);

  // Fetch user's coin balance
  const fetchCoins = useCallback(async () => {
    if (!profileId) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", profileId)
      .single();

    if (error) {
      console.error("Error fetching coins:", error);
      return;
    }

    setCoins(data?.coins || 0);
  }, [profileId]);

  // Buy a property
  const buyProperty = useCallback(async (property: Property) => {
    if (!profileId) {
      toast.error("You must be logged in to buy properties");
      return false;
    }

    if (coins < property.price) {
      toast.error("Not enough coins!");
      return false;
    }

    try {
      // Update property ownership
      const { error: propertyError } = await supabase
        .from("properties")
        .update({
          owner_id: profileId,
          is_for_sale: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", property.id);

      if (propertyError) throw propertyError;

      // Deduct coins from buyer
      const { error: coinsError } = await supabase
        .from("profiles")
        .update({ coins: coins - property.price })
        .eq("id", profileId);

      if (coinsError) throw coinsError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          property_id: property.id,
          buyer_id: profileId,
          amount: property.price,
          transaction_type: "purchase",
        });

      if (transactionError) throw transactionError;

      // Refresh data
      await Promise.all([fetchProperties(), fetchMyProperties(), fetchCoins()]);

      toast.success(`You purchased ${property.name}!`);
      return true;
    } catch (error) {
      console.error("Error buying property:", error);
      toast.error("Failed to purchase property");
      return false;
    }
  }, [profileId, coins, fetchProperties, fetchMyProperties, fetchCoins]);

  // Sell a property back to the marketplace
  const sellProperty = useCallback(async (property: Property, askingPrice: number) => {
    if (!profileId) {
      toast.error("You must be logged in to sell properties");
      return false;
    }

    try {
      // Get 80% of the asking price as immediate sale value
      const saleValue = Math.floor(askingPrice * 0.8);

      // Update property to be for sale and remove ownership
      const { error: propertyError } = await supabase
        .from("properties")
        .update({
          owner_id: null,
          is_for_sale: true,
          price: askingPrice,
          updated_at: new Date().toISOString(),
        })
        .eq("id", property.id);

      if (propertyError) throw propertyError;

      // Add coins to seller
      const { error: coinsError } = await supabase
        .from("profiles")
        .update({ coins: coins + saleValue })
        .eq("id", profileId);

      if (coinsError) throw coinsError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          property_id: property.id,
          seller_id: profileId,
          amount: saleValue,
          transaction_type: "sale",
        });

      if (transactionError) throw transactionError;

      // Refresh data
      await Promise.all([fetchProperties(), fetchMyProperties(), fetchCoins()]);

      toast.success(`Sold ${property.name} for ${saleValue} coins!`);
      return true;
    } catch (error) {
      console.error("Error selling property:", error);
      toast.error("Failed to sell property");
      return false;
    }
  }, [profileId, coins, fetchProperties, fetchMyProperties, fetchCoins]);

  // Initial fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchProperties(),
        fetchPropertyTypes(),
        fetchMyProperties(),
        fetchCoins(),
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [fetchProperties, fetchPropertyTypes, fetchMyProperties, fetchCoins]);

  // Real-time subscription for properties
  useEffect(() => {
    const channel = supabase
      .channel("properties-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "properties" },
        () => {
          fetchProperties();
          fetchMyProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProperties, fetchMyProperties]);

  return {
    properties,
    propertyTypes,
    myProperties,
    coins,
    isLoading,
    buyProperty,
    sellProperty,
    refreshData: () => Promise.all([fetchProperties(), fetchMyProperties(), fetchCoins()]),
  };
}
