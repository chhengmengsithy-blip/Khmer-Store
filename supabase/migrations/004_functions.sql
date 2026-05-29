-- Database Functions

-- Calculate seller rating from reviews
CREATE OR REPLACE FUNCTION calculate_seller_rating(p_seller_id UUID)
RETURNS DECIMAL(3, 2) AS $$
DECLARE
  avg_rating DECIMAL(3, 2);
BEGIN
  SELECT COALESCE(AVG(r.rating)::DECIMAL(3, 2), 0.00)
  INTO avg_rating
  FROM reviews r
  JOIN products p ON r.product_id = p.id
  WHERE p.seller_id = p_seller_id
  AND r.deleted_at IS NULL;

  UPDATE sellers SET rating = avg_rating WHERE id = p_seller_id;
  RETURN avg_rating;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update user trust score based on activity
CREATE OR REPLACE FUNCTION update_trust_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  user_record RECORD;
BEGIN
  SELECT * INTO user_record FROM users_extended WHERE id = p_user_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  -- Base score for verified users
  IF user_record.verification_status = 'approved' THEN
    score := score + 30;
  END IF;

  -- Score from completed orders as buyer
  score := score + LEAST(
    (SELECT COUNT(*) FROM orders WHERE buyer_id = p_user_id AND status = 'delivered')::INTEGER * 2,
    20
  );

  -- Score from positive reviews as seller
  score := score + LEAST(
    (SELECT COUNT(*) FROM reviews r
     JOIN products p ON r.product_id = p.id
     JOIN sellers s ON p.seller_id = s.id
     WHERE s.user_id = p_user_id AND r.rating >= 4)::INTEGER * 3,
    30
  );

  -- Deductions for fraud events
  score := score - LEAST(
    (SELECT COUNT(*) FROM fraud_monitoring WHERE user_id = p_user_id AND resolved = false)::INTEGER * 10,
    50
  );

  -- Clamp between 0 and 100
  score := GREATEST(0, LEAST(100, score));

  UPDATE users_extended SET trust_score = score WHERE id = p_user_id;
  RETURN score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Process escrow release
CREATE OR REPLACE FUNCTION process_escrow_release(p_order_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_order RECORD;
  v_seller_wallet_id UUID;
BEGIN
  -- Lock the order row to prevent concurrent double-release.
  -- Any parallel invocation will block here until this transaction completes.
  SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  IF v_order.escrow_status != 'held' THEN RETURN false; END IF;

  -- Get seller's wallet (also lock it to prevent balance race conditions)
  SELECT w.id INTO v_seller_wallet_id
  FROM wallets w
  JOIN sellers s ON w.user_id = s.user_id
  WHERE s.id = v_order.seller_id
  FOR UPDATE OF w;

  IF v_seller_wallet_id IS NULL THEN RETURN false; END IF;

  -- Release funds to seller (minus commission)
  UPDATE wallets
  SET balance = balance + (v_order.total - v_order.commission)
  WHERE id = v_seller_wallet_id;

  -- Update order escrow status
  UPDATE orders SET escrow_status = 'released' WHERE id = p_order_id;

  -- Record transaction
  INSERT INTO transactions (order_id, type, amount, status, payment_method)
  VALUES (p_order_id, 'escrow_release', v_order.total - v_order.commission, 'completed', 'wallet');

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment product views
CREATE OR REPLACE FUNCTION increment_product_views(p_product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products SET views_count = views_count + 1 WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check fraud score for a user action
CREATE OR REPLACE FUNCTION check_fraud_score(
  p_user_id UUID,
  p_event_type TEXT,
  p_details JSONB DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  risk INTEGER := 0;
  recent_events INTEGER;
  user_record RECORD;
BEGIN
  SELECT * INTO user_record FROM users_extended WHERE id = p_user_id;
  IF NOT FOUND THEN RETURN 100; END IF;

  -- Check recent suspicious events (last 24 hours)
  SELECT COUNT(*) INTO recent_events
  FROM fraud_monitoring
  WHERE user_id = p_user_id
  AND created_at > NOW() - INTERVAL '24 hours';

  risk := recent_events * 15;

  -- New account penalty
  IF user_record.created_at > NOW() - INTERVAL '7 days' THEN
    risk := risk + 20;
  END IF;

  -- Unverified penalty
  IF user_record.verification_status != 'approved' THEN
    risk := risk + 15;
  END IF;

  -- Low trust score penalty
  IF user_record.trust_score < 30 THEN
    risk := risk + 10;
  END IF;

  -- Clamp to 100
  risk := LEAST(100, risk);

  -- Record the event
  INSERT INTO fraud_monitoring (user_id, event_type, risk_score, details)
  VALUES (p_user_id, p_event_type, risk, p_details);

  RETURN risk;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create users_extended row on new auth.users sign-up.
-- This ensures get_user_extended_id() always resolves for authenticated users,
-- preventing RLS policies from silently denying access to newly registered users.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users_extended (auth_user_id, role, verification_status, trust_score)
  VALUES (NEW.id, 'buyer', 'pending', 0)
  ON CONFLICT (auth_user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert (fires after Supabase Auth creates the user)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
