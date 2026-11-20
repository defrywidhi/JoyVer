export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type Service = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price_from: number;
  image_url: string | null;
  category?: { name: string; slug: string } | null;
};

export type TeamMember = {
  id: string;
  name: string;
  role_title: string | null;
  photo_url: string | null;
  bio: string | null;
  skills: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  rating: number;
  message: string;
  created_at: string;
};
