-- Allow public viewing of concerts (no auth required for SELECT)
DROP POLICY IF EXISTS "Concerts are viewable by everyone" ON public.concerts;

CREATE POLICY "Concerts are viewable by everyone"
  ON public.concerts FOR SELECT
  USING (true);