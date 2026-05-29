-- Row-Level Security Policies

-- Enable RLS on all tables
ALTER TABLE users_extended ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ban_system ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_sessions ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's extended ID from auth
CREATE OR REPLACE FUNCTION get_user_extended_id()
RETURNS UUID AS $$
  SELECT id FROM users_extended WHERE auth_user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if current user has admin/moderator role
CREATE OR REPLACE FUNCTION is_admin_or_moderator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users_extended
    WHERE auth_user_id = auth.uid()
    AND role IN ('admin', 'super_admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Users Extended policies
CREATE POLICY "Users can read own extended profile" ON users_extended
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own extended profile" ON users_extended
  FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "Admins can read all users" ON users_extended
  FOR SELECT USING (is_admin_or_moderator());

CREATE POLICY "Admins can update all users" ON users_extended
  FOR UPDATE USING (is_admin_or_moderator());

-- Profiles policies
CREATE POLICY "Anyone can read profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (user_id = get_user_extended_id());

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (user_id = get_user_extended_id());

-- Sellers policies
CREATE POLICY "Anyone can read verified sellers" ON sellers
  FOR SELECT USING (verified = true OR user_id = get_user_extended_id());

CREATE POLICY "Sellers can update own store" ON sellers
  FOR UPDATE USING (user_id = get_user_extended_id());

CREATE POLICY "Users can create seller profile" ON sellers
  FOR INSERT WITH CHECK (user_id = get_user_extended_id());

-- Products policies
CREATE POLICY "Anyone can read published products" ON products
  FOR SELECT USING (status = 'published' OR seller_id IN (
    SELECT id FROM sellers WHERE user_id = get_user_extended_id()
  ));

CREATE POLICY "Sellers can insert own products" ON products
  FOR INSERT WITH CHECK (seller_id IN (
    SELECT id FROM sellers WHERE user_id = get_user_extended_id()
  ));

CREATE POLICY "Sellers can update own products" ON products
  FOR UPDATE USING (seller_id IN (
    SELECT id FROM sellers WHERE user_id = get_user_extended_id()
  ));

CREATE POLICY "Sellers can delete own products" ON products
  FOR DELETE USING (seller_id IN (
    SELECT id FROM sellers WHERE user_id = get_user_extended_id()
  ));

CREATE POLICY "Admins can manage all products" ON products
  FOR ALL USING (is_admin_or_moderator());

-- Product Media policies
CREATE POLICY "Anyone can read product media" ON product_media
  FOR SELECT USING (true);

CREATE POLICY "Sellers can manage own product media" ON product_media
  FOR ALL USING (product_id IN (
    SELECT p.id FROM products p
    JOIN sellers s ON p.seller_id = s.id
    WHERE s.user_id = get_user_extended_id()
  ));

-- Categories policies
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (is_admin_or_moderator());

-- Orders policies
CREATE POLICY "Buyers can read own orders" ON orders
  FOR SELECT USING (buyer_id = get_user_extended_id());

CREATE POLICY "Sellers can read orders for their store" ON orders
  FOR SELECT USING (seller_id IN (
    SELECT id FROM sellers WHERE user_id = get_user_extended_id()
  ));

CREATE POLICY "Buyers can create orders" ON orders
  FOR INSERT WITH CHECK (buyer_id = get_user_extended_id());

CREATE POLICY "Admins can manage all orders" ON orders
  FOR ALL USING (is_admin_or_moderator());

-- Transactions policies
CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT USING (order_id IN (
    SELECT id FROM orders WHERE buyer_id = get_user_extended_id()
    UNION
    SELECT o.id FROM orders o
    JOIN sellers s ON o.seller_id = s.id
    WHERE s.user_id = get_user_extended_id()
  ));

CREATE POLICY "Admins can manage transactions" ON transactions
  FOR ALL USING (is_admin_or_moderator());

-- Wallets policies
CREATE POLICY "Users can read own wallet" ON wallets
  FOR SELECT USING (user_id = get_user_extended_id());

CREATE POLICY "System can update wallets" ON wallets
  FOR UPDATE USING (is_admin_or_moderator());

-- Withdrawals policies
CREATE POLICY "Users can read own withdrawals" ON withdrawals
  FOR SELECT USING (wallet_id IN (
    SELECT id FROM wallets WHERE user_id = get_user_extended_id()
  ));

CREATE POLICY "Users can request withdrawals" ON withdrawals
  FOR INSERT WITH CHECK (wallet_id IN (
    SELECT id FROM wallets WHERE user_id = get_user_extended_id()
  ));

CREATE POLICY "Admins can manage withdrawals" ON withdrawals
  FOR ALL USING (is_admin_or_moderator());

-- Reviews policies
CREATE POLICY "Anyone can read reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Verified purchasers can write reviews" ON reviews
  FOR INSERT WITH CHECK (
    user_id = get_user_extended_id()
    AND verified_purchase = true
  );

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (user_id = get_user_extended_id());

CREATE POLICY "Admins can manage reviews" ON reviews
  FOR ALL USING (is_admin_or_moderator());

-- Favorites policies
CREATE POLICY "Users can read own favorites" ON favorites
  FOR SELECT USING (user_id = get_user_extended_id());

CREATE POLICY "Users can add favorites" ON favorites
  FOR INSERT WITH CHECK (user_id = get_user_extended_id());

CREATE POLICY "Users can remove favorites" ON favorites
  FOR DELETE USING (user_id = get_user_extended_id());

-- Notifications policies
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (user_id = get_user_extended_id());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = get_user_extended_id());

-- Messages policies
CREATE POLICY "Users can read own messages" ON messages
  FOR SELECT USING (
    sender_id = get_user_extended_id()
    OR receiver_id = get_user_extended_id()
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = get_user_extended_id());

-- Verification Documents policies
CREATE POLICY "Users can read own documents" ON verification_documents
  FOR SELECT USING (user_id = get_user_extended_id());

CREATE POLICY "Users can upload documents" ON verification_documents
  FOR INSERT WITH CHECK (user_id = get_user_extended_id());

CREATE POLICY "Admins can manage documents" ON verification_documents
  FOR ALL USING (is_admin_or_moderator());

-- Fraud Monitoring policies
CREATE POLICY "Admins can read fraud monitoring" ON fraud_monitoring
  FOR SELECT USING (is_admin_or_moderator());

CREATE POLICY "Admins can manage fraud monitoring" ON fraud_monitoring
  FOR ALL USING (is_admin_or_moderator());

-- Moderation Logs policies
CREATE POLICY "Admins can read moderation logs" ON moderation_logs
  FOR SELECT USING (is_admin_or_moderator());

CREATE POLICY "Moderators can create logs" ON moderation_logs
  FOR INSERT WITH CHECK (is_admin_or_moderator());

-- Admin Actions policies
CREATE POLICY "Admins can read admin actions" ON admin_actions
  FOR SELECT USING (is_admin_or_moderator());

CREATE POLICY "Admins can create admin actions" ON admin_actions
  FOR INSERT WITH CHECK (is_admin_or_moderator());

-- Coupons policies
CREATE POLICY "Anyone can read active coupons" ON coupons
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage coupons" ON coupons
  FOR ALL USING (is_admin_or_moderator());

-- Analytics Events policies
CREATE POLICY "Users can create analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read analytics" ON analytics_events
  FOR SELECT USING (is_admin_or_moderator());

-- Reports policies
CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (reporter_id = get_user_extended_id());

CREATE POLICY "Users can read own reports" ON reports
  FOR SELECT USING (reporter_id = get_user_extended_id());

CREATE POLICY "Admins can manage reports" ON reports
  FOR ALL USING (is_admin_or_moderator());

-- Ban System policies
CREATE POLICY "Admins can manage bans" ON ban_system
  FOR ALL USING (is_admin_or_moderator());

CREATE POLICY "Users can see own ban status" ON ban_system
  FOR SELECT USING (user_id = get_user_extended_id());

-- Device Sessions policies
CREATE POLICY "Users can read own sessions" ON device_sessions
  FOR SELECT USING (user_id = get_user_extended_id());

CREATE POLICY "Users can manage own sessions" ON device_sessions
  FOR ALL USING (user_id = get_user_extended_id());

CREATE POLICY "Admins can read all sessions" ON device_sessions
  FOR SELECT USING (is_admin_or_moderator());
