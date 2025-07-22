-- Set specific user as admin by email
UPDATE public.profiles 
SET is_admin = true 
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'leonisouza09@gmail.com'
);