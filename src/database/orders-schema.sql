-- =====================================================
-- ORDERS SYSTEM SCHEMA FOR SUPABASE
-- =====================================================
-- This schema handles the complete order lifecycle including:
-- - Order creation and management
-- - Order items (products/services)
-- - Order status tracking
-- - Payment information
-- - Delivery tracking
-- - Order history
-- =====================================================

-- =====================================================
-- 1. ENUMS
-- =====================================================

-- Drop existing types to avoid conflicts
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS delivery_method CASCADE;

-- Order status enum
CREATE TYPE order_status AS ENUM (
  'pending_payment',      -- Order created, awaiting payment
  'payment_confirmed',    -- Payment received and confirmed
  'processing',           -- Order being prepared/processed
  'ready_for_handoff',    -- Order ready for personal handoff (personal delivery only)
  'shipped',              -- Order shipped to customer (shipping only)
  'in_transit',           -- Order in delivery (shipping only)
  'delivered',            -- Order delivered successfully (shipping only)
  'completed',            -- Order completed and confirmed by customer
  'cancelled',            -- Order cancelled by user or agent
  'refunded',             -- Order refunded
  'disputed'              -- Order in dispute/arbitration
);

-- Payment status enum
CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
  'partially_refunded'
);

-- Delivery method enum
CREATE TYPE delivery_method AS ENUM (
  'personal_handoff',
  'standard_shipping',
  'express_shipping',
  'same_day_delivery',
  'international_shipping'
);

-- =====================================================
-- 2. ORDERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS orders (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  
  -- User relationships
  client_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Related entities
  request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  
  -- Order details
  status order_status NOT NULL DEFAULT 'pending_payment',
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'HKD',
  
  -- Payment information
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_transaction_id VARCHAR(100),
  paid_at TIMESTAMPTZ,
  
  -- Delivery information
  delivery_method delivery_method NOT NULL,
  expected_meeting_location TEXT NULL,
  delivery_address JSONB NULL, -- {street, city, state, country, postal_code, phone} - Required for shipping, null for personal_handoff
  tracking_number VARCHAR(100),
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  
  -- Additional information
  cancellation_reason TEXT,
  refund_amount DECIMAL(10, 2),
  refund_reason TEXT,
  
  -- Agent commission
  agent_commission_rate DECIMAL(5, 2) DEFAULT 0, -- Percentage
  agent_commission_amount DECIMAL(10, 2) DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}', -- For extensibility
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- =====================================================
-- 3. ORDER ITEMS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS order_items (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Item details
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT,
  product_image_url TEXT,
  
  -- Pricing
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  
  -- Related offer (if applicable)
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  
  -- Item specifications
  specifications JSONB DEFAULT '{}', -- {size, color, variant, etc}
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 4. ORDER HISTORY TABLE (Status tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Status change
  status order_status NOT NULL,
  previous_status order_status,
  
  -- Who made the change
  changed_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Additional info
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_client_user_id ON orders(client_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_agent_user_id ON orders(agent_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_request_id ON orders(request_id);
CREATE INDEX IF NOT EXISTS idx_orders_offer_id ON orders(offer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_offer_id ON order_items(offer_id);

-- Order history indexes
CREATE INDEX IF NOT EXISTS idx_order_history_order_id ON order_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_history_created_at ON order_history(created_at DESC);

-- =====================================================
-- 6. TRIGGERS
-- =====================================================

-- Drop existing triggers and functions to avoid conflicts
DROP TRIGGER IF EXISTS orders_updated_at_trigger ON orders;
DROP TRIGGER IF EXISTS order_items_updated_at_trigger ON order_items;
DROP TRIGGER IF EXISTS order_status_change_trigger ON orders;
DROP TRIGGER IF EXISTS generate_order_number_trigger ON orders;

DROP FUNCTION IF EXISTS update_orders_updated_at();
DROP FUNCTION IF EXISTS update_order_items_updated_at();
DROP FUNCTION IF EXISTS create_order_history_on_status_change();
DROP FUNCTION IF EXISTS generate_order_number();

-- Auto-update updated_at timestamp for orders
CREATE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at_trigger
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

-- Auto-update updated_at timestamp for order_items
CREATE FUNCTION update_order_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_items_updated_at_trigger
  BEFORE UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_order_items_updated_at();

-- Auto-create order history entry when status changes
CREATE FUNCTION create_order_history_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO order_history (
      order_id,
      status,
      previous_status,
      changed_by_user_id,
      notes
    ) VALUES (
      NEW.id,
      NEW.status,
      OLD.status,
      auth.uid(),
      CASE 
        WHEN NEW.status = 'cancelled' THEN NEW.cancellation_reason
        WHEN NEW.status = 'refunded' THEN NEW.refund_reason
        ELSE NULL
      END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_order_history_on_status_change();

-- Auto-generate order number
CREATE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                        LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Drop existing helper functions to avoid conflicts
DROP FUNCTION IF EXISTS calculate_order_total(UUID);
DROP FUNCTION IF EXISTS get_order_details(UUID);

-- Function to calculate order total from items
CREATE FUNCTION calculate_order_total(p_order_id UUID)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
  v_total DECIMAL(10, 2);
BEGIN
  SELECT COALESCE(SUM(subtotal), 0)
  INTO v_total
  FROM order_items
  WHERE order_id = p_order_id;
  
  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- Function to get orders with full details (including items and users)
CREATE FUNCTION get_order_details(p_order_id UUID)
RETURNS TABLE (
  order_data JSONB,
  items JSONB,
  client_info JSONB,
  agent_info JSONB,
  history JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Order data
    to_jsonb(o.*) as order_data,
    
    -- Order items
    COALESCE(
      (SELECT jsonb_agg(to_jsonb(oi.*))
       FROM order_items oi
       WHERE oi.order_id = o.id),
      '[]'::jsonb
    ) as items,
    
    -- Client info
    (SELECT jsonb_build_object(
      'id', u.id,
      'nickname', u.nickname,
      'image', u.image
    )
    FROM users u
    WHERE u.id = o.client_user_id) as client_info,
    
    -- Agent info
    (SELECT jsonb_build_object(
      'id', u.id,
      'nickname', u.nickname,
      'image', u.image
    )
    FROM users u
    WHERE u.id = o.agent_user_id) as agent_info,
    
    -- Order history
    COALESCE(
      (SELECT jsonb_agg(to_jsonb(oh.*) ORDER BY oh.created_at DESC)
       FROM order_history oh
       WHERE oh.order_id = o.id),
      '[]'::jsonb
    ) as history
    
  FROM orders o
  WHERE o.id = p_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Note: Uncomment below to insert sample data for testing
-- Make sure to replace UUIDs with actual user IDs from your auth.users table

/*
-- Sample order
INSERT INTO orders (
  client_user_id,
  agent_user_id,
  status,
  total_amount,
  currency,
  payment_status,
  delivery_method,
  delivery_address
) VALUES (
  'YOUR_CLIENT_USER_ID',
  'YOUR_AGENT_USER_ID',
  'processing',
  150.00,
  'USD',
  'completed',
  'standard_shipping',
  '{"street": "123 Main St", "city": "New York", "state": "NY", "country": "USA", "postal_code": "10001", "phone": "+1234567890"}'::jsonb
);

-- Sample order items
INSERT INTO order_items (
  order_id,
  product_name,
  product_description,
  quantity,
  unit_price,
  subtotal
) VALUES (
  'YOUR_ORDER_ID',
  'Sample Product',
  'This is a sample product',
  2,
  75.00,
  150.00
);
*/

-- =====================================================
-- END OF SCHEMA
-- =====================================================
