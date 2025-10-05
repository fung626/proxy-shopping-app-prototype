-- Drop the table if it exists
DROP TABLE IF EXISTS users;
-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    nickname TEXT,
    gender TEXT,
    country_code TEXT,
    phone TEXT,
    country TEXT,
    bio TEXT,
    avatar TEXT,
    date_of_birth DATE,
    website TEXT,
    company TEXT,
    job_title TEXT,
    languages TEXT [],
    preferences JSONB DEFAULT '{"categories": []}',
    verification_status JSONB DEFAULT '{"email": false, "phone": false, "identity": false, "business": false}',
    credit_cards JSONB DEFAULT '[]',
    bank_information JSONB,
    transaction_password_enabled BOOLEAN DEFAULT false,
    transaction_password_set BOOLEAN DEFAULT false,
    biometric_auth_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);