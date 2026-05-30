export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ListingStatus = "active" | "pending" | "sold" | "removed";
export type ListingCondition = "new" | "used" | "like_new";
export type UserRole = "user" | "admin";
export type ReportStatus = "pending" | "resolved" | "dismissed";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          location: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          location?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          location?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          description: string | null;
          parent_id: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          description?: string | null;
          parent_id?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string | null;
          description?: string | null;
          parent_id?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
      listings: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          title: string;
          description?: string | null;
          price?: number;
          currency?: string;
          condition?: ListingCondition;
          location?: string | null;
          contact_phone?: string | null;
          contact_name?: string | null;
          images?: string[];
          status?: ListingStatus;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          title?: string;
          description?: string | null;
          price?: number;
          currency?: string;
          condition?: ListingCondition;
          location?: string | null;
          contact_phone?: string | null;
          contact_name?: string | null;
          images?: string[];
          status?: ListingStatus;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          listing_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          listing_id?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          listing_id: string | null;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          listing_id?: string | null;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          listing_id?: string | null;
          content?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          listing_id: string;
          reason: string;
          description: string | null;
          status: ReportStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          listing_id: string;
          reason: string;
          description?: string | null;
          status?: ReportStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          listing_id?: string;
          reason?: string;
          description?: string | null;
          status?: ReportStatus;
          created_at?: string;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Helper types for common operations
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
