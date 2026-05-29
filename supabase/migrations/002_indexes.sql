-- Performance indexes for frequently queried columns

-- Products indexes
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Orders indexes
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_escrow_status ON orders(escrow_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Reviews indexes
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Favorites indexes
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read) WHERE read = false;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Messages indexes
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id, created_at DESC);

-- Fraud monitoring indexes
CREATE INDEX idx_fraud_monitoring_user_id ON fraud_monitoring(user_id);
CREATE INDEX idx_fraud_monitoring_risk_score ON fraud_monitoring(risk_score DESC);
CREATE INDEX idx_fraud_monitoring_unresolved ON fraud_monitoring(resolved) WHERE resolved = false;

-- Transactions indexes
CREATE INDEX idx_transactions_order_id ON transactions(order_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Users extended indexes
CREATE INDEX idx_users_extended_auth_user_id ON users_extended(auth_user_id);
CREATE INDEX idx_users_extended_role ON users_extended(role);
CREATE INDEX idx_users_extended_verification_status ON users_extended(verification_status);

-- Verification documents indexes
CREATE INDEX idx_verification_documents_user_id ON verification_documents(user_id);
CREATE INDEX idx_verification_documents_status ON verification_documents(status);

-- Analytics events indexes
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- Device sessions indexes
CREATE INDEX idx_device_sessions_user_id ON device_sessions(user_id);
CREATE INDEX idx_device_sessions_last_seen ON device_sessions(last_seen DESC);

-- Ban system indexes
CREATE INDEX idx_ban_system_user_id ON ban_system(user_id);
CREATE INDEX idx_ban_system_active ON ban_system(user_id, permanent, expires_at);

-- Reports indexes
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_target ON reports(target_type, target_id);
