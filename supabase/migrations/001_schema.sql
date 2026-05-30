-- Khmer Store V3 Schema
-- Simplified marketplace-listings model

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  condition TEXT NOT NULL DEFAULT 'used' CHECK (condition IN ('new', 'used', 'like_new')),
  location TEXT,
  contact_phone TEXT,
  contact_name TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'removed')),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_all" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Categories policies
CREATE POLICY "categories_select_all" ON categories
  FOR SELECT USING (true);

CREATE POLICY "categories_insert_admin" ON categories
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "categories_update_admin" ON categories
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "categories_delete_admin" ON categories
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Listings policies
CREATE POLICY "listings_select_active_or_own" ON listings
  FOR SELECT USING (status = 'active' OR user_id = auth.uid());

CREATE POLICY "listings_insert_own" ON listings
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "listings_update_own" ON listings
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "listings_delete_own" ON listings
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "listings_admin_all" ON listings
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Favorites policies
CREATE POLICY "favorites_select_own" ON favorites
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "favorites_insert_own" ON favorites
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "favorites_delete_own" ON favorites
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "messages_select_own" ON messages
  FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "messages_insert_own" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Reports policies
CREATE POLICY "reports_insert_own" ON reports
  FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "reports_select_own" ON reports
  FOR SELECT TO authenticated
  USING (reporter_id = auth.uid());

CREATE POLICY "reports_select_admin" ON reports
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO categories (name, slug, icon, description, order_index) VALUES
('Vehicles', 'vehicles', 'Car', 'Cars, motorcycles, and bicycles', 1),
('Property', 'property', 'Home', 'Houses, apartments, and land', 2),
('Electronics', 'electronics', 'Smartphone', 'Phones, computers, and TVs', 3),
('Jobs', 'jobs', 'Briefcase', 'Full-time, part-time, and freelance', 4),
('Services', 'services', 'Wrench', 'Repair, tutoring, and delivery', 5),
('Fashion', 'fashion', 'Shirt', 'Clothing, shoes, and accessories', 6),
('Home & Garden', 'home-garden', 'Flower2', 'Furniture, decor, and garden supplies', 7),
('Sports & Leisure', 'sports-leisure', 'Dumbbell', 'Sports equipment and outdoor activities', 8),
('Digital Products', 'digital-products', 'Gamepad2', 'Game accounts, software, and digital art', 9);

-- ============================================================
-- RPC FUNCTIONS
-- ============================================================

-- Increment listing views
CREATE OR REPLACE FUNCTION increment_views(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE listings SET views_count = views_count + 1 WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
