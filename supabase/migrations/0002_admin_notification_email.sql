-- Add database-managed recipient for Resend order notifications.
-- Empty value means the application falls back to ADMIN_NOTIFICATION_EMAIL.
insert into public.site_settings (key, value)
values ('admin_notification_email', '')
on conflict (key) do nothing;
