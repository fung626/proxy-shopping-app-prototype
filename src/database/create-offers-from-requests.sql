-- Offers generated from requests_rows.sql
-- These inserts create offers that correspond to requests in requests_rows.sql
-- IDs are left to DB default (gen_random_uuid())

INSERT INTO public.offers (user_id, title, description, category, price, currency, location, shopping_location, available_quantity, estimated_delivery, specifications, tags, delivery_options, images, created_at, updated_at, status) VALUES
-- 1: for Bob Chan (多功能收納盒)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 多功能收納盒','New multi-purpose storage box suitable for household organization. Matches requested features: sturdy, multiple compartments, water resistant.','home',110.00,'HKD','Guangzhou, China - Storage Solutions Market','Guangzhou, China - Storage Solutions Market',20,'{"end":7,"unit":"days","start":5}','{"sturdy","waterproof","stackable"}','{"storage","home"}','{"personal_handoff"}','{"https://img.yec.tw/zp/MerchandiseImages/F447AB90DF-SP-10028911.jpg"}', '2025-11-11 13:00:00+00','2025-11-11 13:00:00+00','active'),

-- 2: for John Doe (限量版寶可夢卡牌)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 尋找限量版寶可夢卡牌','I have boxed sealed rare Pokemon cards from Japan series available. Condition: new, sealed.','toys',280.00,'HKD','Tokyo, Japan - Pokémon Center','Tokyo, Japan - Pokémon Center',2,'{"end":2,"unit":"days","start":1}','{"sealed","collector"}','{"pokemon","cards","collectibles"}','{"personal_handoff"}','{"https://m.media-amazon.com/images/I/81LqRAY9FIL.jpg","https://rukminim2.flixcart.com/image/480/640/xif0q/card-game/r/y/e/8-pokemo-cards-55-pcs-foil-card-assorted-cards-v-series-black-original-imagpgg7zzpkkusk.jpeg?q=90"}', '2025-10-01 10:00:00+00','2025-10-01 10:00:00+00','active'),

-- 3: for friday626 (Sony Tps-L2)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for Sony Tps-L2 立體聽 walkman','Portable audio device, Sony TPS-L2 style available.','electronics',4500.00,'HKD','香港','香港',1,'{"end":14,"unit":"days","start":7}','{"vintage","audio"}','{"walkman","sony"}','{"personal_handoff"}','{"https://img.walkman.land/sony/tps-l2/Sony-TPS-L2-01.jpg"}', '2025-11-15 04:50:07.276+00','2025-11-15 04:50:07.276+00','active'),

-- 4: for Cathy Lee (高品質廚房紙巾)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 高品質廚房紙巾','High-absorbency, eco-friendly kitchen paper towels, large rolls available.','home',45.00,'HKD','Beijing, China - Paper Products Market','Beijing, China - Paper Products Market',200,'{"end":4,"unit":"days","start":2}','{"3-ply","large-roll"}','{"kitchen","paper"}','{"personal_handoff"}','{"https://www.pulppy.com/wp-content/uploads/2021/11/TPK0053-Pulppy-3-PLY-Kitchen-Towel-4R-Side.jpg"}', '2025-11-11 14:00:00+00','2025-11-11 14:00:00+00','active'),

-- 5: for Jane Smith (高品質日本廚刀)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 高品質日本廚刀','Professional Japanese kitchen knives (Shun/Global) available. Carbon steel options.','home',450.00,'HKD','Tokyo, Japan - Tsukiji Market area','Tokyo, Japan - Tsukiji Market area',5,'{"end":5,"unit":"days","start":3}','{"8-10inch","carbon-steel"}','{"knife","kitchen"}','{"international_shipping"}','{"https://cdn.shopify.com/s/files/1/0437/4950/7224/files/high_quality.jpg?v=1680151742"}', '2025-10-02 14:30:00+00','2025-10-02 14:30:00+00','active'),

-- 6: for Emily Johnson (韓國護膚套裝)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 韓國護膚套裝 - 水光肌護理','Korean glass-skin 5-step skincare set, from top brands, suitable for sensitive skin.','beauty',150.00,'HKD','Seoul, South Korea - Myeongdong','Seoul, South Korea - Myeongdong',10,'{"end":6,"unit":"days","start":4}','{"5-step","sensitive-friendly"}','{"skincare","kbeauty"}','{"personal_handoff"}','{"https://www.lakinza.ca/cdn/shop/files/glass-skin-5-step-korean-skincare-routine-korean-skincare-127752.jpg?v=1729769277"}', '2025-10-03 09:15:00+00','2025-10-03 09:15:00+00','active'),

-- 7: for Michael Wilson (英國復古樂隊T恤)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 英國復古樂隊T恤','Vintage UK rock band tees from 80s-90s, good condition.','fashion',120.00,'HKD','London, UK - Camden Market','London, UK - Camden Market',8,'{"end":9,"unit":"days","start":7}','{"vintage","80s-90s"}','{"vintage","music","fashion"}','{"standard_shipping"}','{"https://m.media-amazon.com/images/I/71BMG3GYIWL._UY1000_.jpg"}', '2025-10-04 16:45:00+00','2025-10-04 16:45:00+00','active'),

-- 8: for Alex Chen (德國機械鍵盤)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 德國機械鍵盤','High-end mechanical keyboard with Cherry MX switches available (Germany sourced).','electronics',320.00,'HKD','Berlin, Germany - Tech stores','Berlin, Germany - Tech stores',4,'{"end":12,"unit":"days","start":10}','{"Cherry-MX","german-made"}','{"keyboard","mechanical"}','{"international_shipping"}','{"https://cdn.sandberg.world/products/3d_html/640-31/640-31-800-01-01.jpg","https://m.media-amazon.com/images/I/71BkXYRAhoL._UF1000,1000_QL80_.jpg"}', '2025-10-05 11:20:00+00','2025-10-05 11:20:00+00','active'),

-- 9: for Sarah Liu (瑞士手錶零件和工具)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 瑞士手錶零件和工具','Precision Swiss watch parts and tools for antique watch repair.','jewelry',450.00,'HKD','Geneva, Switzerland - Watch district','Geneva, Switzerland - Watch district',3,'{"end":15,"unit":"days","start":13}','{"precision","watchparts"}','{"watch","parts"}','{"international_shipping"}','{"https://monochrome-watches.com/wp-content/uploads/2018/07/Inside-Vaucher-Manufacture-Fleurier-%E2%80%93-How-Exactly-Watch-Parts-Are-Manufactured-9.jpg","https://monochrome-watches.com/wp-content/uploads/2018/07/Inside-Vaucher-Manufacture-Fleurier-%E2%80%93-How-Exactly-Watch-Parts-Are-Manufactured-7.jpg"}', '2025-10-06 13:00:00+00','2025-10-06 13:00:00+00','active'),

-- 10: for David Brown (傳統中國書法毛筆)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 傳統中國書法毛筆','Handmade traditional Chinese calligraphy brushes and inkstone sets.','stationery',80.00,'HKD','Beijing, China - Art supply district','Beijing, China - Art supply district',15,'{"end":18,"unit":"days","start":16}','{"handmade","inkstone"}','{"calligraphy","art"}','{"standard_shipping"}','{"https://artgoldenmaple.com/cdn/shop/files/2_e80b8166-9c7f-4cca-a277-e0bc43fae0d7.jpg?v=1711097345&width=1445"}', '2025-10-07 08:30:00+00','2025-10-07 08:30:00+00','active'),

-- 11: for Lisa Martinez (澳洲戶外裝備)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 澳洲戶外裝備','Durable Australian outdoor gear suitable for harsh conditions.','sports',280.00,'HKD','Sydney, Australia - Outdoor gear shops','Sydney, Australia - Outdoor gear shops',12,'{"end":21,"unit":"days","start":19}','{"uv-protective","durable"}','{"outdoor","hiking"}','{"international_shipping"}','{"https://hikeausnz.com/wp-content/uploads/2019/12/bluegum_lrg__40260.1382312491.1280.1280.jpg"}', '2025-10-08 15:45:00+00','2025-10-08 15:45:00+00','active'),

-- 12: for friday626 (全新 PS2 主機)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 全新 PS2 主機','Sealed PlayStation 2 consoles sourced from Japan, new-in-box.','electronics',1500.00,'HKD','香港','香港',2,'{"end":14,"unit":"days","start":7}','{"sealed","console"}','{"ps2","retro"}','{"personal_handoff"}','{"https://cdn11.bigcommerce.com/s-ymgqt/images/stencil/1000w/products/36541/25041/PS2_in_box__39849.1643918849.jpg?c=2"}', '2025-11-15 04:23:07.002+00','2025-11-15 04:23:07.002+00','active'),

-- 13: for John Doe (法國美食烹飪食材)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 法國美食烹飪食材','Gourmet French ingredients including truffle oil, artisan cheeses and spices.','food',220.00,'HKD','Paris, France - Gourmet food markets','Paris, France - Gourmet food markets',10,'{"end":24,"unit":"days","start":22}','{"gourmet","truffle"}','{"food","gourmet"}','{"international_shipping"}','{"https://www.foodandwine.com/thmb/WBos4rhEqcP1pH1TBt3qU7lP--4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Smoked-Salmon-Lyonnaise-Salad-FT-MAG-RECIPE-1224-81a86adbf03c421f8c3ef736795d7a7c.jpg"}', '2025-10-09 12:15:00+00','2025-10-09 12:15:00+00','active'),

-- 14: for Jane Smith (意大利皮具包袋和配飾)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 意大利皮具包袋和配飾','Genuine Florentine leather bags and accessories, handcrafted.','fashion',320.00,'HKD','Florence, Italy - Leather workshops','Florence, Italy - Leather workshops',6,'{"end":27,"unit":"days","start":25}','{"handmade","florence"}','{"leather","fashion"}','{"international_shipping"}','{"https://www.misuri.com/media/blog/misuri-leather-bags.jpg"}', '2025-10-10 14:00:00+00','2025-10-10 14:00:00+00','active'),

-- 15: for friday626 (Jellycat marshmallows charm)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for jELLYCAT Pair of Marshmallows Bag Charm','Brand new Jellycat bag charm, pair of marshmallows, 15cm.','toys',120.00,'HKD','香港','香港',10,'{"end":14,"unit":"days","start":7}','{"official","new"}','{"jellycat","toy"}','{"personal_handoff"}','{"https://www.babyonline.com.hk/image/cache/data/product/jellycat/2023-2/jellycat-670983144192-1-1200x1200.jpg"}', '2025-11-15 04:39:30.175+00','2025-11-15 04:39:30.175+00','active'),

-- 16: for John Doe (Taylor Swift 演唱會門票)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for Taylor Swift演唱會門票','Good seats available for Taylor Swift Hong Kong show (transferable ticket).','tickets',1200.00,'HKD','Hong Kong - 亞洲國際博覽館','Hong Kong - 亞洲國際博覽館',4,'{"end":3,"unit":"days","start":1}','{"ticket","vip"}','{"concert","tickets"}','{"personal_handoff"}','{"https://media.timeout.com/images/105878143/750/422/image.jpg"}', '2025-11-11 09:00:00+00','2025-11-11 09:00:00+00','active'),

-- 17: for Jane Smith (BTS 世界巡演門票)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for BTS世界巡演演唱會門票','Tickets available for BTS Seoul KSPO Dome show. Reasonable price, good seats.','tickets',1400.00,'HKD','Seoul, South Korea - KSPO Dome','Seoul, South Korea - KSPO Dome',6,'{"end":5,"unit":"days","start":3}','{"ticket"}','{"concert","kpop"}','{"personal_handoff"}','{"https://dimg04.tripcdn.com/images/1mj4b12000iqfpqge5BB9_C_800_600_R5.jpg_.webp?proc=autoorient&proc=source%2Ftrip","https://res.klook.com/image/upload/v1738749994/fz38nrrnwnduqvxr0bdz.jpg"}', '2025-11-12 10:30:00+00','2025-11-12 10:30:00+00','active'),

-- 18: for Emily Johnson (謝霆鋒啟德演唱會2025)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for 謝霆鋒啟德演唱會2025','Tickets available for 谢霆锋 Taipei show (electronic or physical).','tickets',800.00,'HKD','Taipei, Taiwan - 台北小巨蛋','Taipei, Taiwan - 台北小巨蛋',6,'{"end":7,"unit":"days","start":5}','{"ticket"}','{"concert","tickets"}','{"personal_handoff"}','{"https://www.tickethk.com/timthumb.php?w=1000&src=images/posters/1668.jpg&v=90800-7b83"}', '2025-11-13 15:20:00+00','2025-11-13 15:20:00+00','active'),

-- 19: for Michael Wilson (Coldplay 演唱會門票)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for Coldplay演唱會門票','Wembley Stadium Coldplay tickets available, priority standing options.','tickets',1500.00,'HKD','London, UK - Wembley Stadium','London, UK - Wembley Stadium',10,'{"end":10,"unit":"days","start":8}','{"ticket"}','{"concert","coldplay"}','{"international_shipping"}','{"https://image-cdn.hypb.st/https%3A%2F%2Fhk.hypebeast.com%2Ffiles%2F2023%2F05%2Fcoldplay-2023-asia-tour-kaohsiung-tickets-release-info-1.jpeg?q=75&w=800&cbr=1&fit=max"}', '2025-11-14 11:45:00+00','2025-11-14 11:45:00+00','active'),

-- 20: for friday626 (Cole Haan 小白鞋)
('264cb457-c21d-47d0-b56e-1149b958d625','Offer for Cole Haan小白鞋','ZERØGRAND City X-Trainer sneakers (women UK6) available.','fashion',520.00,'HKD','香港','香港',6,'{"end":14,"unit":"days","start":7}','{"UK 6","white"}','{"shoes","fashion"}','{"personal_handoff"}','{"https://qmgrwxwtvddzidzrlrrn.supabase.co/storage/v1/object/public/uploads/request-images/e4dc0e2c-7864-4c92-b450-b6dbd87b4071-1763200046616-cuamgqb8b2s.png","https://qmgrwxwtvddzidzrlrrn.supabase.co/storage/v1/object/public/uploads/request-images/e4dc0e2c-7864-4c92-b450-b6dbd87b4071-1763200048810-5n7tlhzdiq.png"}', '2025-11-15 09:47:30.107+00','2025-11-15 09:47:30.107+00','active');

-- End of generated offers