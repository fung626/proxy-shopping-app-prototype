-- Drop the tables if they exist
DROP TABLE IF EXISTS order_history CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    
    -- Participants
    client_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Related entities
    request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
    offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
    
    -- Order status
    status TEXT NOT NULL DEFAULT 'pending_payment',
    
    -- Financial information
    total_amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    
    -- Payment information
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    payment_transaction_id TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Delivery information
    delivery_method TEXT NOT NULL,
    expected_meeting_location TEXT,
    delivery_address JSONB NOT NULL,
    tracking_number TEXT,
    estimated_delivery_date TIMESTAMP WITH TIME ZONE,
    actual_delivery_date TIMESTAMP WITH TIME ZONE,
    
    -- Additional information
    notes TEXT,
    cancellation_reason TEXT,
    refund_amount NUMERIC(10, 2),
    refund_reason TEXT,
    
    -- Agent commission
    agent_commission_rate NUMERIC(5, 2) DEFAULT 0.00,
    agent_commission_amount NUMERIC(10, 2) DEFAULT 0.00,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Product information
    product_name TEXT NOT NULL,
    product_description TEXT,
    product_image_url TEXT,
    
    -- Pricing
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    
    -- References
    offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
    
    -- Additional specifications
    specifications JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_history table
CREATE TABLE IF NOT EXISTS order_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Status change information
    status TEXT NOT NULL,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert test order data based on requests
INSERT INTO "public"."orders" (
    "id", "order_number", "client_user_id", "agent_user_id", "request_id", "offer_id", 
    "status", "total_amount", "currency", "payment_status", "payment_method", "paid_at",
    "delivery_method", "expected_meeting_location", "delivery_address", "tracking_number", "estimated_delivery_date",
    "notes", "agent_commission_rate", "agent_commission_amount", 
    "created_at", "updated_at", "completed_at"
) VALUES
-- Order 1: 多功能收納盒 - Completed
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ORD-20251110-001000', 
 '264cb457-c21d-47d0-b56e-1149b958d625', '01debdb5-7784-439f-870c-37ea485042bc',
 '11223344-5566-7788-99aa-bbccddeeff00', NULL,
 'completed', 85.00, 'HKD', 'completed', 'credit_card', '2025-11-10 14:00:00+00',
 'personal_handoff', 'Sha Tin Plaza', 
 '{"fullName":"Bob Chan","phone":"","street":"Sha Tin","addressLine2":"","city":"Hong Kong","state":"","postalCode":"","country":"HKG"}',
 'HK123456789CN', '2025-11-17 00:00:00+00',
 'Order for multi-functional storage box from Guangzhou', 0.00, 0.00,
 '2025-11-10 13:30:00+00', '2025-11-15 10:00:00+00', '2025-11-15 10:00:00+00'),

-- Order 2: 寶可夢卡牌 - In Transit
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'ORD-20251101-001001',
 '01debdb5-7784-439f-870c-37ea485042bc', '264cb457-c21d-47d0-b56e-1149b958d625',
 '11aabbcc-ddee-1122-3344-556677889900', NULL,
 'in_transit', 175.00, 'HKD', 'completed', 'paypal', '2025-11-01 11:00:00+00',
 'personal_handoff', 'Tokyo Pokemon Center',
 '{"fullName":"John Smith","phone":"","street":"123 Main St","addressLine2":"Apt 4B","city":"Los Angeles","state":"CA","postalCode":"90210","country":"USA"}',
 'JP987654321US', '2025-11-16 00:00:00+00',
 'Rare Pokemon cards from Tokyo Pokemon Center', 0.00, 0.00,
 '2025-11-01 10:30:00+00', '2025-11-14 09:00:00+00', NULL),

-- Order 3: 廚房紙巾 - Shipped
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'ORD-20251112-001002',
 '01debdb5-7784-439f-870c-37ea485042bc', '264cb457-c21d-47d0-b56e-1149b958d625',
 '22334455-6677-8899-aabb-ccddeeff0011', NULL,
 'shipped', 35.00, 'HKD', 'completed', 'credit_card', '2025-11-12 15:00:00+00',
 'personal_handoff', 'Tuen Mun Town Plaza',
 '{"fullName":"Cathy Lee","phone":"","street":"Tuen Mun","addressLine2":"","city":"Hong Kong","state":"","postalCode":"","country":"HKG"}',
 'CN555666777HK', '2025-11-18 00:00:00+00',
 'High quality kitchen towels bulk pack', 0.00, 0.00,
 '2025-11-12 14:30:00+00', '2025-11-14 16:00:00+00', NULL),

-- Order 4: 日本廚刀 - Processing
('d4e5f6a7-b8c9-0123-def0-234567890123', 'ORD-20251103-001003',
 '264cb457-c21d-47d0-b56e-1149b958d625', '01debdb5-7784-439f-870c-37ea485042bc',
 '22bbccdd-eeff-2233-4455-667788990011', NULL,
 'processing', 325.00, 'HKD', 'completed', 'credit_card', '2025-11-03 16:00:00+00',
 'personal_handoff', 'Tsukiji Market',
 '{"fullName":"Jane Smith","phone":"","street":"","addressLine2":"","city":"Hong Kong","state":"","postalCode":"","country":"HKG"}',
 NULL, '2025-11-20 00:00:00+00',
 'Professional Japanese chef knife from Tsukiji Market', 0.00, 0.00,
 '2025-11-03 15:30:00+00', '2025-11-15 11:00:00+00', NULL),

-- Order 5: 韓國護膚套裝 - Delivered
('e5f6a7b8-c9d0-1234-ef01-345678901234', 'ORD-20251104-001004',
 '01debdb5-7784-439f-870c-37ea485042bc', '264cb457-c21d-47d0-b56e-1149b958d625',
 '33ccddee-ffaa-3344-5566-778899001122', NULL,
 'delivered', 140.00, 'HKD', 'completed', 'credit_card', '2025-11-04 10:00:00+00',
 'personal_handoff', 'Myeongdong Shopping Street',
 '{"fullName":"Emily Johnson","phone":"","street":"456 Broadway","addressLine2":"","city":"New York","state":"NY","postalCode":"10001","country":"USA"}',
 'KR111222333US', '2025-11-19 00:00:00+00',
 'Korean skincare set for glass skin from Myeongdong', 0.00, 0.00,
 '2025-11-04 09:30:00+00', '2025-11-14 14:00:00+00', NULL),

-- Order 6: 復古樂隊T恤 - Completed
('f6a7b8c9-d0e1-2345-f012-456789012345', 'ORD-20251105-001005',
 '264cb457-c21d-47d0-b56e-1149b958d625', '01debdb5-7784-439f-870c-37ea485042bc',
 '44ddeeff-aabb-4455-6677-889900112233', NULL,
 'completed', 90.00, 'HKD', 'completed', 'paypal', '2025-11-05 17:30:00+00',
 'personal_handoff', NULL,
 '{"fullName":"Mike Wilson","phone":"","street":"789 Queen St W","addressLine2":"Unit 12","city":"Toronto","state":"ON","postalCode":"M6J 1G1","country":"Canada"}',
 'UK444555666CA', '2025-11-22 00:00:00+00',
 'Vintage British rock band t-shirts from Camden Market', 0.00, 0.00,
 '2025-11-05 17:00:00+00', '2025-11-13 12:00:00+00', '2025-11-13 12:00:00+00'),

-- Order 7: 機械鍵盤 - In Transit
('a7b8c9d0-e1f2-3456-0123-567890123456', 'ORD-20251106-001006',
 '01debdb5-7784-439f-870c-37ea485042bc', '264cb457-c21d-47d0-b56e-1149b958d625',
 '55eeffaa-bbcc-5566-7788-990011223344', NULL,
 'in_transit', 300.00, 'HKD', 'completed', 'credit_card', '2025-11-06 12:00:00+00',
 'personal_handoff', 'Berlin Tech District',
 '{"fullName":"Alex Chen","phone":"","street":"321 Tech Blvd","addressLine2":"Floor 5","city":"San Francisco","state":"CA","postalCode":"94105","country":"USA"}',
 'DE777888999US', '2025-11-25 00:00:00+00',
 'German mechanical keyboard with Cherry MX switches', 0.00, 0.00,
 '2025-11-06 11:30:00+00', '2025-11-14 13:00:00+00', NULL),

-- Order 8: 瑞士手錶工具 - Processing
('b8c9d0e1-f2a3-4567-1234-678901234567', 'ORD-20251107-001007',
 '264cb457-c21d-47d0-b56e-1149b958d625', '01debdb5-7784-439f-870c-37ea485042bc',
 '66ffaabb-ccdd-6677-8899-001122334455', NULL,
 'processing', 350.00, 'HKD', 'completed', 'credit_card', '2025-11-07 14:00:00+00',
 'personal_handoff', 'Geneva Old Town',
 '{"fullName":"Sarah Liu","phone":"","street":"","addressLine2":"","city":"Miami","state":"FL","postalCode":"","country":"USA"}',
 NULL, '2025-11-28 00:00:00+00',
 'Swiss watch repair tools and parts from Geneva', 0.00, 0.00,
 '2025-11-07 13:30:00+00', '2025-11-15 10:30:00+00', NULL),

-- Order 9: 書法毛筆 - Shipped
('c9d0e1f2-a3b4-5678-2345-789012345678', 'ORD-20251108-001008',
 '01debdb5-7784-439f-870c-37ea485042bc', '264cb457-c21d-47d0-b56e-1149b958d625',
 '77aabbcc-ddee-7788-9900-112233445566', NULL,
 'shipped', 80.00, 'HKD', 'completed', 'paypal', '2025-11-08 09:00:00+00',
 'personal_handoff', 'Beijing Art District',
 '{"fullName":"David Brown","phone":"","street":"654 Granville St","addressLine2":"","city":"Vancouver","state":"BC","postalCode":"V6C 1X8","country":"Canada"}',
 'CN999000111CA', '2025-11-30 00:00:00+00',
 'Traditional Chinese calligraphy brushes and inkstone', 0.00, 0.00,
 '2025-11-08 08:30:00+00', '2025-11-14 15:00:00+00', NULL),

-- Order 10: Taylor Swift門票 - Payment Confirmed
('d0e1f2a3-b4c5-6789-3456-890123456789', 'ORD-20251111-001009',
 '01debdb5-7784-439f-870c-37ea485042bc', '264cb457-c21d-47d0-b56e-1149b958d625',
 'bbccddef-fabb-bb22-3344-556677889911', NULL,
 'payment_confirmed', 1650.00, 'HKD', 'completed', 'credit_card', '2025-11-11 10:00:00+00',
 'personal_handoff', 'Central District',
 '{"fullName":"John Doe","phone":"","street":"Central District","addressLine2":"","city":"Hong Kong","state":"","postalCode":"","country":"HKG"}',
 NULL, NULL,
 'Taylor Swift concert tickets - VIP section', 0.00, 0.00,
 '2025-11-11 09:30:00+00', '2025-11-11 10:00:00+00', NULL);

-- Insert order items (using gen_random_uuid() for IDs)
INSERT INTO "public"."order_items" (
    "order_id", "product_name", "product_description", "product_image_url",
    "quantity", "unit_price", "subtotal", "specifications"
) VALUES
-- Order 1 items
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 
 '多功能收納盒', '堅固耐用的多隔層收納盒，防水材質，可堆疊設計',
 'https://img.yec.tw/zp/MerchandiseImages/F447AB90DF-SP-10028911.jpg',
 1, 85.00, 85.00, '{"material":"plastic","size":"large","color":"transparent"}'),

-- Order 2 items
('b2c3d4e5-f6a7-8901-bcde-f12345678901',
 '限量版寶可夢卡牌套裝', '來自東京寶可夢中心的正品稀有卡牌，全新密封包裝',
 'https://m.media-amazon.com/images/I/81LqRAY9FIL.jpg',
 1, 175.00, 175.00, '{"edition":"Japanese","condition":"mint","sealed":true}'),

-- Order 3 items
('c3d4e5f6-a7b8-9012-cdef-123456789012',
 '高品質廚房紙巾 - 大卷裝', '吸水性強且耐用的環保廚房紙巾，12卷裝',
 'https://www.pulppy.com/wp-content/uploads/2021/11/TPK0053-Pulppy-3-PLY-Kitchen-Towel-4R-Side.jpg',
 1, 35.00, 35.00, '{"rolls":12,"ply":"3-ply","eco_friendly":true}'),

-- Order 4 items
('d4e5f6a7-b8c9-0123-def0-234567890123',
 '日本Shun主廚刀 8英吋', '專業級別日本廚刀，碳鋼材質，來自築地市場地區',
 'https://cdn.shopify.com/s/files/1/0437/4950/7224/files/high_quality.jpg?v=1680151742',
 1, 325.00, 325.00, '{"brand":"Shun","length":"8 inch","material":"carbon steel","origin":"Japan"}'),

-- Order 5 items
('e5f6a7b8-c9d0-1234-ef01-345678901234',
 '韓國水光肌護膚套裝', '完整的韓國護膚程序套裝，適合敏感肌，來自明洞',
 'https://www.lakinza.ca/cdn/shop/files/glass-skin-5-step-korean-skincare-routine-korean-skincare-127752.jpg?v=1729769277',
 1, 140.00, 140.00, '{"steps":5,"skin_type":"sensitive","origin":"Korea"}'),

-- Order 6 items
('f6a7b8c9-d0e1-2345-f012-456789012345',
 '復古英國搖滾樂隊T恤', '80-90年代正宗復古T恤，來自Camden Market，狀態良好',
 'https://m.media-amazon.com/images/I/71BMG3GYIWL._UY1000_.jpg',
 2, 45.00, 90.00, '{"era":"80s-90s","size":"L","condition":"good","authentic":true}'),

-- Order 7 items
('a7b8c9d0-e1f2-3456-0123-567890123456',
 '德國Cherry MX機械鍵盤', '高端機械鍵盤，Cherry MX軸，全尺寸帶RGB燈光',
 'https://cdn.sandberg.world/products/3d_html/640-31/640-31-800-01-01.jpg',
 1, 300.00, 300.00, '{"switch":"Cherry MX","size":"full","rgb":true,"origin":"Germany"}'),

-- Order 8 items
('b8c9d0e1-f2a3-4567-1234-678901234567',
 '瑞士手錶維修工具套裝', '正宗瑞士製造的精密手錶維修工具和替換零件',
 'https://monochrome-watches.com/wp-content/uploads/2018/07/Inside-Vaucher-Manufacture-Fleurier-%E2%80%93-How-Exactly-Watch-Parts-Are-Manufactured-9.jpg',
 1, 350.00, 350.00, '{"origin":"Switzerland","professional_grade":true,"includes":"tools and parts"}'),

-- Order 9 items
('c9d0e1f2-a3b4-5678-2345-789012345678',
 '傳統中國書法套裝', '手工毛筆套裝含硯台，傳統材料製作',
 'https://artgoldenmaple.com/cdn/shop/files/2_e80b8166-9c7f-4cca-a277-e0bc43fae0d7.jpg?v=1711097345&width=1445',
 1, 80.00, 80.00, '{"handmade":true,"includes":"brushes and inkstone","traditional":true}'),

-- Order 10 items
('d0e1f2a3-b4c5-6789-3456-890123456789',
 'Taylor Swift演唱會門票 - VIP區', '香港場次VIP區門票，亞洲國際博覽館',
 'https://media.timeout.com/images/105878143/750/422/image.jpg',
 2, 825.00, 1650.00, '{"venue":"AsiaWorld-Expo","section":"VIP","seats":2,"event_date":"2025-12-15"}');

-- Insert order history
INSERT INTO "public"."order_history" (
    "order_id", "status", "changed_by", "created_at"
) VALUES
-- Order 1 history (Completed)
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'pending_payment', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-10 13:30:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'payment_confirmed', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-10 14:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'processing', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-10 15:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'delivered', NULL, '2025-11-14 16:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'completed', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-15 10:00:00+00'),

-- Order 2 history (In Transit)
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'pending_payment', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-01 10:30:00+00'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'payment_confirmed', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-01 11:00:00+00'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'processing', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-02 10:00:00+00'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'in_transit', NULL, '2025-11-08 08:00:00+00'),

-- Order 3 history (Shipped)
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'pending_payment', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-12 14:30:00+00'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'payment_confirmed', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-12 15:00:00+00'),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'processing', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-13 10:00:00+00'),

-- Order 4 history (Processing)
('d4e5f6a7-b8c9-0123-def0-234567890123', 'pending_payment', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-03 15:30:00+00'),
('d4e5f6a7-b8c9-0123-def0-234567890123', 'payment_confirmed', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-03 16:00:00+00'),
('d4e5f6a7-b8c9-0123-def0-234567890123', 'processing', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-04 09:00:00+00'),

-- Order 5 history (Delivered)
('e5f6a7b8-c9d0-1234-ef01-345678901234', 'pending_payment', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-04 09:30:00+00'),
('e5f6a7b8-c9d0-1234-ef01-345678901234', 'payment_confirmed', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-04 10:00:00+00'),
('e5f6a7b8-c9d0-1234-ef01-345678901234', 'processing', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-05 11:00:00+00'),
('e5f6a7b8-c9d0-1234-ef01-345678901234', 'delivered', NULL, '2025-11-14 14:00:00+00'),

-- Order 6 history (Completed)
('f6a7b8c9-d0e1-2345-f012-456789012345', 'pending_payment', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-05 17:00:00+00'),
('f6a7b8c9-d0e1-2345-f012-456789012345', 'payment_confirmed', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-05 17:30:00+00'),
('f6a7b8c9-d0e1-2345-f012-456789012345', 'processing', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-06 10:00:00+00'),
('f6a7b8c9-d0e1-2345-f012-456789012345', 'delivered', NULL, '2025-11-12 10:00:00+00'),
('f6a7b8c9-d0e1-2345-f012-456789012345', 'completed', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-13 12:00:00+00'),

-- Order 7 history (In Transit)
('a7b8c9d0-e1f2-3456-0123-567890123456', 'pending_payment', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-06 11:30:00+00'),
('a7b8c9d0-e1f2-3456-0123-567890123456', 'payment_confirmed', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-06 12:00:00+00'),
('a7b8c9d0-e1f2-3456-0123-567890123456', 'processing', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-07 14:00:00+00'),
('a7b8c9d0-e1f2-3456-0123-567890123456', 'in_transit', NULL, '2025-11-13 09:00:00+00'),

-- Order 8 history (Processing)
('b8c9d0e1-f2a3-4567-1234-678901234567', 'pending_payment', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-07 13:30:00+00'),
('b8c9d0e1-f2a3-4567-1234-678901234567', 'payment_confirmed', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-07 14:00:00+00'),
('b8c9d0e1-f2a3-4567-1234-678901234567', 'processing', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-08 10:00:00+00'),

-- Order 9 history (Shipped)
('c9d0e1f2-a3b4-5678-2345-789012345678', 'pending_payment', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-08 08:30:00+00'),
('c9d0e1f2-a3b4-5678-2345-789012345678', 'payment_confirmed', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-08 09:00:00+00'),
('c9d0e1f2-a3b4-5678-2345-789012345678', 'processing', '264cb457-c21d-47d0-b56e-1149b958d625', '2025-11-09 10:00:00+00'),

-- Order 10 history (Payment Confirmed)
('d0e1f2a3-b4c5-6789-3456-890123456789', 'pending_payment', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-11 09:30:00+00'),
('d0e1f2a3-b4c5-6789-3456-890123456789', 'payment_confirmed', '01debdb5-7784-439f-870c-37ea485042bc', '2025-11-11 10:00:00+00');
