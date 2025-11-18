-- Drop the table if it exists
DROP TABLE IF EXISTS offers CASCADE;
-- Ensure the `delivery_method` enum type exists (safe create)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'delivery_method') THEN
        CREATE TYPE delivery_method AS ENUM (
            'personal_handoff',
            'standard_shipping',
            'express_shipping',
            'same_day_delivery',
            'international_shipping'
        );
    END IF;
END
$$;

-- Drop the table if it exists
DROP TABLE IF EXISTS offers CASCADE;
-- Ensure the `delivery_method` enum type exists (safe create)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'delivery_method') THEN
        CREATE TYPE delivery_method AS ENUM (
            'personal_handoff',
            'standard_shipping',
            'express_shipping',
            'same_day_delivery',
            'international_shipping'
        );
    END IF;
END
$$;
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
    delivery_options delivery_method [],
    delivery_method delivery_method DEFAULT 'personal_handoff',
    images TEXT [],
    processing_time TEXT,
    agent_id UUID,
    availability TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEED INSERT BLOCK REMOVED
-- The original malformed INSERT containing arrays/JSON was removed to prevent SQL errors.
-- If you want to re-enable seeds, please:
-- 1) Reformat array values to Postgres arrays: {"a","b","c"}
-- 2) Ensure delivery_options values match the `delivery_method` enum
-- 3) Make any JSON fields valid JSON (no extra surrounding quotes)
-- Example safe row (uncomment to use):
-- INSERT INTO public.offers (id, user_id, title, description, category, price, currency, location, shopping_location, available_quantity, estimated_delivery, specifications, tags, delivery_options, images, created_at, updated_at, status) VALUES
-- ('00000000-0000-0000-0000-000000000000','264cb457-c21d-47d0-b56e-1149b958d625','Example Item','Example description','other',9.99,'USD','Nowhere','Store',1,'{"end":3,"type":"days","start":1}','{"Spec A","Spec B"}','{"tag1","tag2"}','{"personal_handoff"}','{"https://example.com/image.jpg"}','2025-01-01 00:00:00+00','2025-01-01 00:00:00+00','active');

-- Add 20 demo offers (well-formed for Postgres)
INSERT INTO public.offers (user_id, title, description, category, price, currency, location, shopping_location, available_quantity, estimated_delivery, specifications, tags, delivery_options, delivery_method, images, created_at, updated_at, status) VALUES
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Phone A','Demo phone A, like-new','electronics',699.99,'USD','New York, NY','Demo Store NYC',10,'{"start":2,"end":5,"type":"days"}','{"128GB","Black"}','{"phone","electronics"}','{"personal_handoff"}', 'personal_handoff','{"https://via.placeholder.com/400x300?text=Phone+A"}', '2025-01-01 00:00:00+00','2025-01-01 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Laptop B','Lightweight laptop B','electronics',1199.00,'USD','San Francisco, CA','Demo Store SF',5,'{"start":3,"end":7,"type":"days"}','{"256GB SSD","8GB RAM"}','{"laptop","computer"}','{"standard_shipping"}', 'personal_handoff','{"https://via.placeholder.com/400x300?text=Laptop+B"}', '2025-01-02 00:00:00+00','2025-01-02 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Headphones C','Noise-cancelling headphones','electronics',199.99,'USD','Los Angeles, CA','Demo Store LA',15,'{"start":1,"end":3,"type":"days"}','{"Black","Wireless"}','{"audio","headphones"}','{"personal_handoff"}', 'personal_handoff','{"https://via.placeholder.com/400x300?text=Headphones+C"}', '2025-01-03 00:00:00+00','2025-01-03 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Jacket D','Warm winter jacket D','fashion',129.50,'USD','Chicago, IL','Demo Store CHI',8,'{"start":4,"end":10,"type":"days"}','{"Large","Blue"}','{"jacket","clothing"}','{"standard_shipping"}', 'personal_handoff','{"https://via.placeholder.com/400x300?text=Jacket+D"}', '2025-01-04 00:00:00+00','2025-01-04 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Mug E','Ceramic mug E','home',12.99,'USD','Seattle, WA','Demo Store SEA',50,'{"start":2,"end":6,"type":"days"}','{"350ml","White"}','{"mug","kitchen"}','{"personal_handoff"}','{"https://via.placeholder.com/400x300?text=Mug+E"}', '2025-01-05 00:00:00+00','2025-01-05 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Mug E','Ceramic mug E','home',12.99,'USD','Seattle, WA','Demo Store SEA',50,'{"start":2,"end":6,"type":"days"}','{"350ml","White"}','{"mug","kitchen"}','{"personal_handoff"}', 'personal_handoff',"{\"https://via.placeholder.com/400x300?text=Mug+E\"}", '2025-01-05 00:00:00+00','2025-01-05 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Book F','Bestselling book F','books',18.00,'USD','Boston, MA','Demo Bookstore',25,'{"start":3,"end":8,"type":"days"}','{"Paperback"}','{"book","reading"}','{"standard_shipping"}','{"https://via.placeholder.com/400x300?text=Book+F"}', '2025-01-06 00:00:00+00','2025-01-06 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Book F','Bestselling book F','books',18.00,'USD','Boston, MA','Demo Bookstore',25,'{"start":3,"end":8,"type":"days"}','{"Paperback"}','{"book","reading"}','{"standard_shipping"}', 'personal_handoff','{"https://via.placeholder.com/400x300?text=Book+F"}', '2025-01-06 00:00:00+00','2025-01-06 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Sneakers G','Comfortable sneakers G','fashion',89.99,'USD','Portland, OR','Demo Footwear',12,'{"start":5,"end":12,"type":"days"}','{"Size 9","White"}','{"sneakers","shoes"}','{"standard_shipping"}','{"https://via.placeholder.com/400x300?text=Sneakers+G"}', '2025-01-07 00:00:00+00','2025-01-07 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Sneakers G','Comfortable sneakers G','fashion',89.99,'USD','Portland, OR','Demo Footwear',12,'{"start":5,"end":12,"type":"days"}','{"Size 9","White"}','{"sneakers","shoes"}','{"standard_shipping"}', 'personal_handoff','{"https://via.placeholder.com/400x300?text=Sneakers+G"}', '2025-01-07 00:00:00+00','2025-01-07 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Coffee H','Specialty coffee beans H','food',15.50,'USD','Seattle, WA','Demo Roaster',100,'{"start":2,"end":5,"type":"days"}','{"250g"}','{"coffee","food"}','{"personal_handoff"}','{"https://via.placeholder.com/400x300?text=Coffee+H"}', '2025-01-08 00:00:00+00','2025-01-08 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Coffee H','Specialty coffee beans H','food',15.50,'USD','Seattle, WA','Demo Roaster',100,'{"start":2,"end":5,"type":"days"}','{"250g"}','{"coffee","food"}','{"personal_handoff"}', 'personal_handoff','{"https://via.placeholder.com/400x300?text=Coffee+H"}', '2025-01-08 00:00:00+00','2025-01-08 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Camera I','Compact camera I','electronics',549.00,'USD','San Diego, CA','Demo Camera Shop',3,'{"start":3,"end":7,"type":"days"}','{"20MP","Black"}','{"camera","photography"}','{"express_shipping"}','{"https://via.placeholder.com/400x300?text=Camera+I"}', '2025-01-09 00:00:00+00','2025-01-09 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Camera I','Compact camera I','electronics',549.00,'USD','San Diego, CA','Demo Camera Shop',3,'{"start":3,"end":7,"type":"days"}','{"20MP","Black"}','{"camera","photography"}','{"express_shipping"}', 'personal_handoff','{"https://via.placeholder.com/400x300?text=Camera+I"}', '2025-01-09 00:00:00+00','2025-01-09 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Chair J','Ergonomic chair J','home',249.99,'USD','Austin, TX','Demo Furniture',7,'{"start":7,"end":14,"type":"days"}','{"Assembly Required"}','{"chair","furniture"}','{"standard_shipping"}','{"https://via.placeholder.com/400x300?text=Chair+J"}', '2025-01-10 00:00:00+00','2025-01-10 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Chair J','Ergonomic chair J','home',249.99,'USD','Austin, TX','Demo Furniture',7,'{"start":7,"end":14,"type":"days"}','{"Assembly Required"}','{"chair","furniture"}','{"standard_shipping"}', 'personal_handoff','{"https://via.placeholder.com/400x300?text=Chair+J"}', '2025-01-10 00:00:00+00','2025-01-10 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Toy K','Educational toy K','kids',34.99,'USD','Denver, CO','Demo Toys',30,'{"start":2,"end":6,"type":"days"}','{"Ages 3+"}','{"toy","kids"}','{"personal_handoff"}','{"https://via.placeholder.com/400x300?text=Toy+K"}', '2025-01-11 00:00:00+00','2025-01-11 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Watch L','Stylish watch L','fashion',199.00,'USD','Miami, FL','Demo Watches',6,'{"start":3,"end":6,"type":"days"}','{"Leather Strap"}','{"watch","accessory"}','{"express_shipping"}','{"https://via.placeholder.com/400x300?text=Watch+L"}', '2025-01-12 00:00:00+00','2025-01-12 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Lamp M','Desk lamp M','home',45.00,'USD','Philadelphia, PA','Demo Lighting',18,'{"start":4,"end":9,"type":"days"}','{"LED"}','{"lamp","home"}','{"standard_shipping"}','{"https://via.placeholder.com/400x300?text=Lamp+M"}', '2025-01-13 00:00:00+00','2025-01-13 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Backpack N','Travel backpack N','fashion',79.99,'USD','San Jose, CA','Demo Bags',20,'{"start":5,"end":12,"type":"days"}','{"20L"}','{"backpack","travel"}','{"standard_shipping"}','{"https://via.placeholder.com/400x300?text=Backpack+N"}', '2025-01-14 00:00:00+00','2025-01-14 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Perfume O','Signature perfume O','beauty',59.00,'USD','Las Vegas, NV','Demo Beauty',40,'{"start":3,"end":7,"type":"days"}','{"50ml"}','{"perfume","beauty"}','{"personal_handoff"}','{"https://via.placeholder.com/400x300?text=Perfume+O"}', '2025-01-15 00:00:00+00','2025-01-15 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Bicycle P','Folding bicycle P','sports',499.99,'USD','Minneapolis, MN','Demo Bikes',2,'{"start":7,"end":21,"type":"days"}','{"Foldable"}','{"bike","sports"}','{"international_shipping"}','{"https://via.placeholder.com/400x300?text=Bicycle+P"}', '2025-01-16 00:00:00+00','2025-01-16 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Game Q','Board game Q','games',29.95,'USD','Orlando, FL','Demo Games',35,'{"start":2,"end":5,"type":"days"}','{"2-6 players"}','{"game","board"}','{"standard_shipping"}','{"https://via.placeholder.com/400x300?text=Game+Q"}', '2025-01-17 00:00:00+00','2025-01-17 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Pillow R','Memory foam pillow R','home',39.99,'USD','Houston, TX','Demo Home',22,'{"start":5,"end":10,"type":"days"}','{"Queen Size"}','{"pillow","sleep"}','{"standard_shipping"}','{"https://via.placeholder.com/400x300?text=Pillow+R"}', '2025-01-18 00:00:00+00','2025-01-18 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Plant S','Potted indoor plant S','home',24.99,'USD','Phoenix, AZ','Demo Nursery',30,'{"start":2,"end":4,"type":"days"}','{"10cm pot"}','{"plant","home"}','{"personal_handoff"}','{"https://via.placeholder.com/400x300?text=Plant+S"}', '2025-01-19 00:00:00+00','2025-01-19 00:00:00+00','active'),
('264cb457-c21d-47d0-b56e-1149b958d625','Demo Snack T','Assorted snacks T (10pcs)','food',19.99,'USD','Honolulu, HI','Demo Snacks',60,'{"start":1,"end":3,"type":"days"}','{"10-pack"}','{"snack","food"}','{"standard_shipping"}','{"https://via.placeholder.com/400x300?text=Snack+T"}', '2025-01-20 00:00:00+00','2025-01-20 00:00:00+00','active');