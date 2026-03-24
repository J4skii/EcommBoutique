-- Create store_settings table for admin-configurable settings like bank details
CREATE TABLE IF NOT EXISTS store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default bank details for EFT payments
INSERT INTO store_settings (setting_key, setting_value, description) VALUES
    ('bank_name', 'First National Bank', 'Bank name for EFT payments'),
    ('account_number', '1234567890', 'Account number for EFT payments'),
    ('account_type', 'Cheque', 'Account type (Cheque/Savings/Current)'),
    ('branch_code', '123456', 'Branch code for EFT payments'),
    ('account_holder', 'Monica''s Bow Boutique', 'Account holder name'),
    ('payment_instructions', 'Please make payment within 48 hours. Email proof of payment to info@monicasbowboutique.co.za', 'Instructions shown to customers on checkout')
ON CONFLICT (setting_key) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_store_settings_key ON store_settings(setting_key);
