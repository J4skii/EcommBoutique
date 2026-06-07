-- Migration 03: Add Staff RBAC System
-- Run this in Supabase SQL Editor

-- 1. Update admin_users table with role and activity fields
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'viewer'
    CHECK (role IN ('superadmin', 'manager', 'viewer')),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT;

-- 2. Make the first admin a superadmin (update with your email)
UPDATE admin_users SET role = 'superadmin', is_active = true
WHERE role = 'viewer';

-- 3. Create staff_audit_log table
CREATE TABLE IF NOT EXISTS staff_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  target_email TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_audit_log_admin_user_id ON staff_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_staff_audit_log_created_at ON staff_audit_log(created_at DESC);

-- 4. Create staff_invitations table
CREATE TABLE IF NOT EXISTS staff_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer'
    CHECK (role IN ('superadmin', 'manager', 'viewer')),
  invitation_code TEXT NOT NULL UNIQUE,
  invited_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_invitations_email ON staff_invitations(email);
CREATE INDEX IF NOT EXISTS idx_staff_invitations_code ON staff_invitations(invitation_code);

-- 5. Row Level Security for audit log (only admins can see logs)
ALTER TABLE staff_audit_log ENABLE ROW LEVEL SECURITY;

-- Allow superadmin to view all audit logs
CREATE POLICY "superadmin_view_all_audit_logs" ON staff_audit_log
  FOR SELECT USING (true);

-- Allow staff to view their own audit entries
CREATE POLICY "staff_view_own_audit_logs" ON staff_audit_log
  FOR SELECT USING (admin_user_id::text = auth.uid()::text);

-- 6. Grant service role access for server-side operations
GRANT ALL ON staff_audit_log TO service_role;
GRANT ALL ON staff_invitations TO service_role;
