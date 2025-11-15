-- Migration: Create Orders Tables and Functions
-- Description: Sets up the complete order management system for proxy shopping app
-- Date: 2024-12-16

-- =====================================================
-- 1. CREATE ORDERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    
    -- Participants
    client_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Related entities
    request_id UUID REFERENCES public.requests(id) ON DELETE SET NULL,
    offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
    
    -- Order status
    status TEXT NOT NULL DEFAULT 'pending_payment' 
        CHECK (status IN (
            'pending_payment',
            'payment_confirmed', 
            'processing',
            'shipped',
            'in_transit',
            'delivered',
            'completed',
            'cancelled',
            'refunded',
            'disputed'
        )),
    
    -- Financial information
    total_amount DECIMAL(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    
    -- Payment information
    payment_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded')),
    payment_method TEXT,
    payment_transaction_id TEXT,
    paid_at TIMESTAMPTZ,
    
    -- Delivery information
    delivery_method TEXT NOT NULL
        CHECK (delivery_method IN ('pickup', 'standard_shipping', 'express_shipping', 'same_day_delivery', 'international_shipping')),
    delivery_address JSONB NOT NULL,
    tracking_number TEXT,
    estimated_delivery_date TIMESTAMPTZ,
    actual_delivery_date TIMESTAMPTZ,
    
    -- Additional information
    notes TEXT,
    cancellation_reason TEXT,
    refund_amount DECIMAL(10, 2),
    refund_reason TEXT,
    
    -- Agent commission
    agent_commission_rate DECIMAL(5, 2) DEFAULT 10.00,
    agent_commission_amount DECIMAL(10, 2),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- Create indexes for orders table
CREATE INDEX IF NOT EXISTS idx_orders_client_user_id ON public.orders(client_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_agent_user_id ON public.orders(agent_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_request_id ON public.orders(request_id);
CREATE INDEX IF NOT EXISTS idx_orders_offer_id ON public.orders(offer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Create order number sequence and function
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- =====================================================
-- 2. CREATE ORDER ITEMS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    
    -- Product information
    product_name TEXT NOT NULL,
    product_description TEXT,
    product_image_url TEXT,
    
    -- Pricing
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    
    -- References
    offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
    
    -- Additional specifications
    specifications JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for order_items table
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_offer_id ON public.order_items(offer_id);

-- =====================================================
-- 3. CREATE ORDER HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.order_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    
    -- Status change information
    status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for order_history table
CREATE INDEX IF NOT EXISTS idx_order_history_order_id ON public.order_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_history_created_at ON public.order_history(created_at DESC);

-- =====================================================
-- 4. CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_order_items_updated_at
    BEFORE UPDATE ON public.order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ADD ORDER_ID TO CONVERSATIONS TABLE
-- =====================================================

-- Add order_id column to conversations if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'conversations' 
        AND column_name = 'order_id'
    ) THEN
        ALTER TABLE public.conversations
        ADD COLUMN order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL;
        
        CREATE INDEX idx_conversations_order_id ON public.conversations(order_id);
    END IF;
END $$;

-- =====================================================
-- 6. UPDATE GET_OR_CREATE_CONVERSATION FUNCTION
-- =====================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_or_create_conversation(UUID, UUID, UUID, UUID);
DROP FUNCTION IF EXISTS get_or_create_conversation(UUID, UUID, UUID, UUID, UUID);

-- Create updated function with order_id support
CREATE OR REPLACE FUNCTION get_or_create_conversation(
    user1_id UUID,
    user2_id UUID,
    req_id UUID DEFAULT NULL,
    off_id UUID DEFAULT NULL,
    ord_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    conversation_id UUID;
BEGIN
    -- Try to find existing conversation between these users
    SELECT c.id INTO conversation_id
    FROM conversations c
    INNER JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
    INNER JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
    WHERE cp1.user_id = user1_id
      AND cp2.user_id = user2_id
      AND cp1.user_id != cp2.user_id
    LIMIT 1;

    -- If no conversation exists, create one
    IF conversation_id IS NULL THEN
        INSERT INTO conversations (request_id, offer_id, order_id)
        VALUES (req_id, off_id, ord_id)
        RETURNING id INTO conversation_id;

        -- Add both users as participants
        INSERT INTO conversation_participants (conversation_id, user_id)
        VALUES 
            (conversation_id, user1_id),
            (conversation_id, user2_id);
    ELSE
        -- Update existing conversation with new context if provided
        UPDATE conversations
        SET 
            request_id = COALESCE(req_id, request_id),
            offer_id = COALESCE(off_id, offer_id),
            order_id = COALESCE(ord_id, order_id),
            updated_at = NOW()
        WHERE id = conversation_id;
    END IF;

    RETURN conversation_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) - DISABLED FOR DEMO
-- =====================================================

-- RLS disabled for demo purposes - all authenticated users can access all data

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================

-- Grant usage on sequences
GRANT USAGE ON SEQUENCE order_number_seq TO authenticated;

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.order_items TO authenticated;
GRANT SELECT, INSERT ON public.order_history TO authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

COMMENT ON TABLE public.orders IS 'Stores all orders in the proxy shopping system';
COMMENT ON TABLE public.order_items IS 'Stores individual items within each order';
COMMENT ON TABLE public.order_history IS 'Tracks status changes and history for orders';
