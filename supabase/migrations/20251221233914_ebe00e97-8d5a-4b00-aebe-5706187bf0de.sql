-- Drop the existing permissive policy
DROP POLICY IF EXISTS "Roles are viewable by authenticated users" ON public.user_roles;

-- Create a restrictive policy: users can only see their own roles, admins can see all
CREATE POLICY "Users can view own roles or admins can view all"
ON public.user_roles
FOR SELECT
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));