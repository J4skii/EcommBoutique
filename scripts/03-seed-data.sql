-- Insert sample products
INSERT INTO products (name, description, price, stock_quantity, colors, sizes, is_featured, sku, weight_grams) VALUES
('Classic Rose Bow', 'Elegant rose-colored bow perfect for any occasion. Handcrafted with premium faux leather.', 45.00, 8, ARRAY['rose', 'pink'], ARRAY['medium', 'large'], true, 'BOW-ROSE-001', 25),
('Midnight Black Bow', 'Sophisticated black bow for formal events. Timeless elegance in premium faux leather.', 50.00, 5, ARRAY['black'], ARRAY['small', 'medium', 'large'], true, 'BOW-BLACK-001', 30),
('Sunshine Yellow Bow', 'Bright and cheerful yellow bow to brighten your day. Perfect for spring and summer.', 42.00, 0, ARRAY['yellow', 'gold'], ARRAY['medium'], false, 'BOW-YELLOW-001', 22),
('Forest Green Bow', 'Natural green bow inspired by forest walks. Earthy elegance for nature lovers.', 48.00, 6, ARRAY['green', 'forest'], ARRAY['medium', 'large'], true, 'BOW-GREEN-001', 28),
('Royal Purple Bow', 'Luxurious purple bow for special occasions. Rich color with premium finish.', 52.00, 4, ARRAY['purple', 'royal'], ARRAY['large', 'xl'], false, 'BOW-PURPLE-001', 32),
('Ocean Blue Bow', 'Calming blue bow reminiscent of ocean waves. Serene beauty in faux leather.', 46.00, 7, ARRAY['blue', 'navy'], ARRAY['small', 'medium'], true, 'BOW-BLUE-001', 26);

-- Insert discount codes
INSERT INTO discount_codes (code, description, type, value, minimum_order_amount, usage_limit, valid_until) VALUES
('PAITON20', 'Welcome discount - 20% off first order', 'percentage', 20.00, 100.00, 100, NOW() + INTERVAL '3 months'),
('FREESHIP300', 'Free shipping on orders over R300', 'free_shipping', 0.00, 300.00, NULL, NOW() + INTERVAL '1 year'),
('SUMMER15', 'Summer special - 15% off', 'percentage', 15.00, 150.00, 50, NOW() + INTERVAL '2 months');

-- Insert admin user (password: 'paiton123' - should be properly hashed in production)
INSERT INTO admin_users (email, password_hash, first_name, last_name) VALUES
('paiton@paitonsboutique.co.za', '$2b$10$example_hash_here', 'Paiton', 'Bow Maker');
