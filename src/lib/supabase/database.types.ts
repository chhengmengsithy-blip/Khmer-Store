export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users_extended: {
        Row: {
          id: string;
          auth_user_id: string;
          role: UserRole;
          verification_status: VerificationStatusType;
          trust_score: number;
          is_banned: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          role?: UserRole;
          verification_status?: VerificationStatusType;
          trust_score?: number;
          is_banned?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          auth_user_id?: string;
          role?: UserRole;
          verification_status?: VerificationStatusType;
          trust_score?: number;
          is_banned?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          phone: string | null;
          date_of_birth: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      sellers: {
        Row: {
          id: string;
          user_id: string;
          business_name: string;
          description: string | null;
          verified: boolean;
          commission_rate: number;
          rating: number;
          total_sales: number;
          store_logo: string | null;
          store_banner: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_name: string;
          description?: string | null;
          verified?: boolean;
          commission_rate?: number;
          rating?: number;
          total_sales?: number;
          store_logo?: string | null;
          store_banner?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_name?: string;
          description?: string | null;
          verified?: boolean;
          commission_rate?: number;
          rating?: number;
          total_sales?: number;
          store_logo?: string | null;
          store_banner?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          category_id: string | null;
          title: string;
          slug: string;
          description: string;
          price: number;
          currency: string;
          condition: string | null;
          status: ProductStatus;
          stock: number;
          featured: boolean;
          views_count: number;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          seller_id: string;
          category_id?: string | null;
          title: string;
          slug: string;
          description?: string;
          price: number;
          currency?: string;
          condition?: string | null;
          status?: ProductStatus;
          stock?: number;
          featured?: boolean;
          views_count?: number;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          seller_id?: string;
          category_id?: string | null;
          title?: string;
          slug?: string;
          description?: string;
          price?: number;
          currency?: string;
          condition?: string | null;
          status?: ProductStatus;
          stock?: number;
          featured?: boolean;
          views_count?: number;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      product_media: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          type: MediaType;
          display_order: number;
          alt_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          type?: MediaType;
          display_order?: number;
          alt_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          type?: MediaType;
          display_order?: number;
          alt_text?: string | null;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          seller_id: string;
          status: OrderStatusType;
          total: number;
          commission: number;
          escrow_status: EscrowStatus;
          shipping_address: string | null;
          tracking_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          seller_id: string;
          status?: OrderStatusType;
          total: number;
          commission?: number;
          escrow_status?: EscrowStatus;
          shipping_address?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          seller_id?: string;
          status?: OrderStatusType;
          total?: number;
          commission?: number;
          escrow_status?: EscrowStatus;
          shipping_address?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          order_id: string | null;
          type: TransactionType;
          amount: number;
          status: TransactionStatus;
          payment_method: PaymentMethodType | null;
          stripe_id: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          type: TransactionType;
          amount: number;
          status?: TransactionStatus;
          payment_method?: PaymentMethodType | null;
          stripe_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          type?: TransactionType;
          amount?: number;
          status?: TransactionStatus;
          payment_method?: PaymentMethodType | null;
          stripe_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          balance: number;
          currency: string;
          frozen_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance?: number;
          currency?: string;
          frozen_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          balance?: number;
          currency?: string;
          frozen_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      withdrawals: {
        Row: {
          id: string;
          wallet_id: string;
          amount: number;
          status: WithdrawalStatus;
          method: WithdrawalMethod;
          processed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wallet_id: string;
          amount: number;
          status?: WithdrawalStatus;
          method: WithdrawalMethod;
          processed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet_id?: string;
          amount?: number;
          status?: WithdrawalStatus;
          method?: WithdrawalMethod;
          processed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          verified_purchase: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          verified_purchase?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          verified_purchase?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          read: boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string;
          read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string;
          read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read_at?: string | null;
          created_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          read_at?: string | null;
          created_at?: string;
          deleted_at?: string | null;
        };
      };
      verification_documents: {
        Row: {
          id: string;
          user_id: string;
          type: DocumentType;
          file_url: string;
          status: DocumentStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: DocumentType;
          file_url: string;
          status?: DocumentStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: DocumentType;
          file_url?: string;
          status?: DocumentStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      fraud_monitoring: {
        Row: {
          id: string;
          user_id: string;
          event_type: string;
          risk_score: number;
          details: Json | null;
          resolved: boolean;
          resolved_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: string;
          risk_score?: number;
          details?: Json | null;
          resolved?: boolean;
          resolved_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_type?: string;
          risk_score?: number;
          details?: Json | null;
          resolved?: boolean;
          resolved_by?: string | null;
          created_at?: string;
        };
      };
      moderation_logs: {
        Row: {
          id: string;
          moderator_id: string;
          action: string;
          target_type: string;
          target_id: string;
          reason: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          moderator_id: string;
          action: string;
          target_type: string;
          target_id: string;
          reason?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          moderator_id?: string;
          action?: string;
          target_type?: string;
          target_id?: string;
          reason?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      admin_actions: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action: string;
          details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          action?: string;
          details?: Json | null;
          created_at?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: DiscountType;
          discount_value: number;
          min_order: number | null;
          max_uses: number | null;
          current_uses: number;
          expires_at: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type: DiscountType;
          discount_value: number;
          min_order?: number | null;
          max_uses?: number | null;
          current_uses?: number;
          expires_at?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: DiscountType;
          discount_value?: number;
          min_order?: number | null;
          max_uses?: number | null;
          current_uses?: number;
          expires_at?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          user_id: string | null;
          event_type: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_type: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          event_type?: string;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          target_type: ReportTargetType;
          target_id: string;
          reason: string;
          status: ReportStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          target_type: ReportTargetType;
          target_id: string;
          reason: string;
          status?: ReportStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string;
          target_type?: ReportTargetType;
          target_id?: string;
          reason?: string;
          status?: ReportStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      ban_system: {
        Row: {
          id: string;
          user_id: string;
          banned_by: string;
          reason: string;
          expires_at: string | null;
          permanent: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          banned_by: string;
          reason: string;
          expires_at?: string | null;
          permanent?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          banned_by?: string;
          reason?: string;
          expires_at?: string | null;
          permanent?: boolean;
          created_at?: string;
        };
      };
      device_sessions: {
        Row: {
          id: string;
          user_id: string;
          device_fingerprint: string | null;
          ip_address: string | null;
          user_agent: string | null;
          last_seen: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          device_fingerprint?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          last_seen?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          device_fingerprint?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          last_seen?: string;
          created_at?: string;
        };
      };
    };
    Functions: {
      calculate_seller_rating: {
        Args: { p_seller_id: string };
        Returns: number;
      };
      update_trust_score: {
        Args: { p_user_id: string };
        Returns: number;
      };
      process_escrow_release: {
        Args: { p_order_id: string };
        Returns: boolean;
      };
      increment_product_views: {
        Args: { p_product_id: string };
        Returns: undefined;
      };
      check_fraud_score: {
        Args: { p_user_id: string; p_event_type: string; p_details?: Json };
        Returns: number;
      };
    };
    Enums: Record<string, never>;
  };
};

// Enum types used in the database
export type UserRole =
  | "guest"
  | "pending_user"
  | "buyer"
  | "seller"
  | "moderator"
  | "support_staff"
  | "admin"
  | "super_admin";

export type VerificationStatusType =
  | "pending"
  | "pending_verification"
  | "approved"
  | "rejected"
  | "suspended";

export type ProductStatus = "draft" | "published" | "archived" | "suspended";

export type MediaType = "image" | "video" | "3d_model";

export type OrderStatusType =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "disputed";

export type EscrowStatus = "held" | "released" | "refunded" | "disputed";

export type TransactionType =
  | "payment"
  | "refund"
  | "commission"
  | "withdrawal"
  | "escrow_hold"
  | "escrow_release";

export type TransactionStatus = "pending" | "completed" | "failed" | "cancelled";

export type PaymentMethodType =
  | "card"
  | "bank_transfer"
  | "crypto"
  | "cod"
  | "wallet";

export type WithdrawalStatus = "pending" | "processing" | "completed" | "rejected";

export type WithdrawalMethod = "bank_transfer" | "crypto" | "paypal";

export type DocumentType =
  | "id_card"
  | "passport"
  | "birth_certificate"
  | "selfie"
  | "proof_of_address";

export type DocumentStatus = "pending" | "approved" | "rejected";

export type DiscountType = "percentage" | "fixed";

export type ReportTargetType = "product" | "user" | "review" | "message";

export type ReportStatus = "pending" | "investigating" | "resolved" | "dismissed";

// Helper types for common operations
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
