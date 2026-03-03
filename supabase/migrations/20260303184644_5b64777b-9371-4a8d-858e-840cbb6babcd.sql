
-- Fix search_path on functions
ALTER FUNCTION public.update_updated_at() SET search_path = public;
ALTER FUNCTION public.decrement_stock() SET search_path = public;
