-- Performance indexes
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_reviews_approved ON product_reviews(is_approved) WHERE is_approved = true;

CREATE INDEX idx_cart_customer ON cart_items(customer_id);
CREATE INDEX idx_wishlist_customer ON wishlist_items(customer_id);

CREATE INDEX idx_custom_orders_status ON custom_order_requests(status);
CREATE INDEX idx_custom_orders_created ON custom_order_requests(created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
