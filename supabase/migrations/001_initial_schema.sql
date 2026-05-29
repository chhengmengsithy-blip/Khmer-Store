-- Khmer Store Initial Schema
-- All tables use UUID primary keys, created_at/updated_at timestamps

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Extended (profile data beyond auth.users)
CREATE TABLE users_extended (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('guest', 'pending_user', 'buyer', 'seller', 'moderator', 'support_staff', 'admin', 'super_admin')),
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'pending_verification', 'approved', 'rejected', 'suspended')),
  trust_score INTEGER NOT NULL DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  is_banned BOOLEAN NOT NULL DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Profiles (public profile info)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users_extended(id) ON DELETE CASCADE,
  display_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  city TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Sellers
CREATE TABLE sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users_extended(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  commission_rate DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
  total_sales INTEGER NOT NULL DEFAULT 0,
  store_logo TEXT,
  store_banner TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Categories (with nested support via parent_id)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'suspended')),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured BOOLEAN NOT NULL DEFAULT false,
  views_count INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Product Media
CREATE TABLE product_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video', '3d_model')),
  display_order INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'disputed')),
  total DECIMAL(12, 2) NOT NULL CHECK (total >= 0),
  commission DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (commission >= 0),
  escrow_status TEXT NOT NULL DEFAULT 'held' CHECK (escrow_status IN ('held', 'released', 'refunded', 'disputed')),
  shipping_address TEXT,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('payment', 'refund', 'commission', 'withdrawal', 'escrow_hold', 'escrow_release')),
  amount DECIMAL(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  payment_method TEXT CHECK (payment_method IN ('card', 'bank_transfer', 'crypto', 'cod', 'wallet')),
  stripe_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Wallets
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users_extended(id) ON DELETE CASCADE,
  balance DECIMAL(12, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  frozen_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00 CHECK (frozen_amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Withdrawals
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  method TEXT NOT NULL CHECK (method IN ('bank_transfer', 'crypto', 'paypal')),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Verification Documents
CREATE TABLE verification_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('id_card', 'passport', 'birth_certificate', 'selfie', 'proof_of_address')),
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users_extended(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fraud Monitoring
CREATE TABLE fraud_monitoring (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  details JSONB,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID REFERENCES users_extended(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Moderation Logs
CREATE TABLE moderation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  moderator_id UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin Actions
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(12, 2) NOT NULL CHECK (discount_value > 0),
  min_order DECIMAL(12, 2) DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users_extended(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('product', 'user', 'review', 'message')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ban System
CREATE TABLE ban_system (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  banned_by UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  permanent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Device Sessions
CREATE TABLE device_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_extended(id) ON DELETE CASCADE,
  device_fingerprint TEXT,
  ip_address TEXT,
  user_agent TEXT,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_extended_updated_at BEFORE UPDATE ON users_extended FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON sellers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON withdrawals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verification_documents_updated_at BEFORE UPDATE ON verification_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
