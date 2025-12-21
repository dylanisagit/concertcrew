-- Drop existing overly permissive SELECT policies
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Comments are viewable by authenticated users" ON public.comments;

-- Create new secure policies that require authentication
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Comments are viewable by authenticated users"
ON public.comments
FOR SELECT
TO authenticated
USING (true);