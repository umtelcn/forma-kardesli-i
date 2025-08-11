// lib/types.ts

// Takımların temel bilgilerini içeren tip.
// Renk alanları eklendi.
export type Team = {
  id: number;
  name: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  created_at?: string;
};

// Her bir formayı (ürünü) temsil eden tip.
export type Product = {
  id: number;
  team_id: number;
  image_url: string | null;
  price: number;
  description: string | null;
  age_range: string | null;
  created_at?: string;
};

// Bir formanın, ait olduğu takım bilgileriyle birlikte
// veritabanından çekildiği zaman kullanılacak özel tip.
export type ProductWithTeam = Product & {
  teams: Team;
};

// Bağış yapma sürecinde kullanılan geçici veriyi tutan tip.
// Teşekkür kartı için renk ve logo alanları eklendi.
export type Donation = {
  type: 'jersey' | 'pool';
  teamId: number;
  teamName: string;
  quantity: number | null;
  total: number;
  imageUrl?: string | null;
  teamLogo?: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
};

// Takımların toplam forma bağışlarını gösteren liderlik tablosu için tip.
export type Total = {
  name: string;
  logo_url: string | null;
  total_jerseys: number;
};

// Bağışçı bilgilerini içeren tip.
export type Donor = {
  id: number;
  name: string | null;
  surname: string | null;
  email: string | null;
  instagram_handle: string | null;
  twitter_handle: string | null;
  display_name: string | null;
  identity_type: 'name' | 'instagram' | 'twitter' | null;
  created_at?: string;
};

// Son bağışlar listesinde gösterilecek her bir bağışın detaylı tipi.
export type RecentDonation = {
  id: number;
  created_at: string;
  type: 'jersey' | 'pool';
  quantity: number | null;
  amount_tl: number;
  teams: {
    id: number;
    name: string;
    logo_url: string | null;
  };
  donors: Donor; // Donor tipini doğrudan kullanıyoruz.
};

// Sıkça Sorulan Sorular bölümü için tip.
export type FAQ = {
  q: string;
  a: string;
};
