export interface PropertyType {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  icon: string;
  model_type: string;
  created_at: string;
}

export interface Property {
  id: string;
  property_type_id: string;
  name: string;
  description: string | null;
  price: number;
  owner_id: string | null;
  position_x: number;
  position_y: number;
  position_z: number;
  is_for_sale: boolean;
  created_at: string;
  updated_at: string;
  property_type?: PropertyType;
  owner?: {
    id: string;
    username: string;
    avatar_color: string;
  };
}

export interface MarketplaceListing {
  id: string;
  property_id: string;
  seller_id: string;
  asking_price: number;
  listed_at: string;
  is_active: boolean;
  property?: Property;
  seller?: {
    id: string;
    username: string;
    avatar_color: string;
  };
}

export interface Transaction {
  id: string;
  property_id: string | null;
  buyer_id: string | null;
  seller_id: string | null;
  amount: number;
  transaction_type: 'purchase' | 'sale' | 'coins_earned';
  created_at: string;
}

export interface PlayerWallet {
  coins: number;
  properties: Property[];
}
