-- Drop the table if it exists
DROP TABLE IF EXISTS requests;
-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_name TEXT,
    title TEXT NOT NULL,
    description TEXT,
    specific_requirements JSONB,
    category TEXT,
    budget_min NUMERIC(10, 2),
    budget_max NUMERIC(10, 2),
    currency TEXT,
    product_origin TEXT,
    designated_purchasing_location TEXT,
    expected_delivery_location TEXT,
    expected_delivery JSONB,
    shipping_address JSONB,
    delivery_method TEXT DEFAULT 'personal',
    images JSONB,
    status TEXT,
    urgency TEXT,
    offers JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);