export type UserRole = "user" | "admin";
export type ListingStatus = "active" | "pending" | "sold" | "removed";
export type ListingCondition = "new" | "used" | "like_new";
export type ReportStatus = "pending" | "resolved" | "dismissed";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  parent_id: string | null;
  order_index: number;
  created_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  condition: ListingCondition;
  location: string | null;
  contact_phone: string | null;
  contact_name: string | null;
  images: string[];
  status: ListingStatus;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  listing_id: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  listing_id: string;
  reason: string;
  description: string | null;
  status: ReportStatus;
  created_at: string;
}

// Keep User type for backward compatibility with auth-store
export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
