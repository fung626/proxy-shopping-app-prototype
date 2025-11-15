-- Drop the table if it exists
DROP TABLE IF EXISTS offers;
-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'HKD',
    location TEXT,
    shopping_location TEXT,
    available_quantity INTEGER DEFAULT 1,
    estimated_delivery JSONB,
    specifications TEXT [],
    tags TEXT [],
    delivery_options TEXT [],
    images TEXT [],
    processing_time TEXT,
    agent_id UUID,
    availability TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);