// Takımların temel bilgilerini içeren tip.
// Artık fiyat ve forma görseli burada değil, 'Product' tipinde.
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

// Son bağışlar listesinde gösterilecek her bir bağışın detaylı tipi.
export type RecentDonation = {
  created_at: string;
  type: 'jersey' | 'pool';
  quantity: number | null;
  amount_tl: number;
  teams: {
    name: string;
    logo_url: string | null;
  }[]; // Dizi olarak tanımlandı, çünkü Supabase sorgusu birden fazla takım döndürebilir
  donors: {
    display_name: string;
    identity_type: 'name' | 'instagram' | 'twitter';
  }[];
};

// Sıkça Sorulan Sorular bölümü için tip.
export type FAQ = {
  q: string;
  a: string;
};