// Takımların temel bilgilerini içeren tip.
export type Team = {
  id: number;
  name: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  created_at?: string;
};

// Her bir formayı (ürünü) temsil eden yeni tip.
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
export type Donation = {
  type: 'jersey' | 'pool';
  teamId: number;
  teamName: string;
  quantity: number | null;
  total: number;
  imageUrl?: string | null;
};

// Takımların toplam forma bağışlarını gösteren liderlik tablosu için tip.
export type Total = {
  name: string;
  logo_url: string | null;
  total_jerseys: number;
};

// Donor bilgileri
export type Donor = {
  id: number;
  name: string;
  surname: string;
  email: string;
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
  // Join ile gelen team bilgisi
  teams: {
    id: number;
    name: string;
    logo_url: string | null;
  };
  // Join ile gelen donor bilgisi
  donors: {
    id: number;
    display_name: string | null;
    identity_type: 'name' | 'instagram' | 'twitter' | null;
    instagram_handle: string | null;
    twitter_handle: string | null;
    name: string;
    surname: string;
  };
};

// Sıkça Sorulan Sorular bölümü için tip.
export type FAQ = {
  q: string;
  a: string;
};