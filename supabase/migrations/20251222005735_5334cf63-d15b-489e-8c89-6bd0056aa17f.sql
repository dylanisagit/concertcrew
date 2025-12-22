-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view their own profile or admins can view all" ON public.profiles;

-- Create a policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Create a separate policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));