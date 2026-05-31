-- 005_security_fixes.sql
-- Security and data integrity improvements

-- =============================================================================
-- 1. RLS Role Escalation Fix: BEFORE UPDATE trigger on users_extended
--    Prevents any non-admin user from changing the role column.
-- =============================================================================

CREATE OR REPLACE FUNCTION prevent_role_self_escalation()
RETURNS TRIGGER AS $$
DECLARE
  caller_role TEXT;
BEGIN
  -- Service-role connections (auth.uid() IS NULL) bypass this trigger
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- If role is not being changed, allow the update
  IF NEW.role IS NOT DISTINCT FROM OLD.role THEN
    RETURN NEW;
  END IF;

  -- Allow buyer -> seller transition when the user is updating their own row
  IF OLD.auth_user_id = auth.uid()
     AND OLD.role = 'buyer'
     AND NEW.role = 'seller' THEN
    RETURN NEW;
  END IF;

  -- Look up the caller's current role
  SELECT role INTO caller_role
  FROM users_extended
  WHERE auth_user_id = auth.uid();

  -- Only admin or super_admin may change a user's role
  IF caller_role IS NULL OR caller_role NOT IN ('admin', 'super_admin') THEN
    RAISE EXCEPTION 'Unauthorized: only admins can change user roles';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON users_extended;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON users_extended
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_self_escalation();

-- =============================================================================
-- 2. Escrow Release Idempotency: partial unique index on transactions
--    Ensures duplicate escrow_release transactions cannot be created for the
--    same order, even if the SELECT ... FOR UPDATE lock is somehow bypassed.
-- =============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_escrow_release_unique
  ON transactions (order_id)
  WHERE type = 'escrow_release' AND status = 'completed';

-- =============================================================================
-- 3. Product condition column
--    Adds a typed condition field directly on the products table.
-- =============================================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS condition TEXT
  CHECK (condition IN ('new', 'like_new', 'used'));
