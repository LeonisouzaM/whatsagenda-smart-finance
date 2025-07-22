-- Set the first user as admin (this is just for testing purposes)
-- In production, you would set this manually through SQL or an admin interface
UPDATE public.profiles 
SET is_admin = true 
WHERE user_id = (
  SELECT user_id 
  FROM public.profiles 
  ORDER BY created_at ASC 
  LIMIT 1
);