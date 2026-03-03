
-- Create productos table
CREATE TABLE public.productos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  precio NUMERIC NOT NULL,
  precio_original NUMERIC,
  cantidad INTEGER NOT NULL DEFAULT 0,
  categoria TEXT NOT NULL DEFAULT 'General',
  imagen_url TEXT,
  promocion BOOLEAN NOT NULL DEFAULT false,
  porcentaje_descuento INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pedidos table
CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_nombre TEXT NOT NULL,
  cliente_telefono TEXT,
  total NUMERIC NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create detalle_pedido table
CREATE TABLE public.detalle_pedido (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES public.productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario NUMERIC NOT NULL
);

-- Create app_role enum and user_roles table for admin
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Enable RLS on all tables
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalle_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Productos: public read, admin write
CREATE POLICY "Anyone can read productos" ON public.productos FOR SELECT USING (true);
CREATE POLICY "Admins can insert productos" ON public.productos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update productos" ON public.productos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete productos" ON public.productos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Pedidos: admin can read all, anyone can insert
CREATE POLICY "Anyone can insert pedidos" ON public.pedidos FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read pedidos" ON public.pedidos FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update pedidos" ON public.pedidos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Detalle pedido: admin read, insert with pedido
CREATE POLICY "Anyone can insert detalle_pedido" ON public.detalle_pedido FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read detalle_pedido" ON public.detalle_pedido FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User roles: only viewable by the user themselves
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.productos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Function to decrement stock on order detail insert
CREATE OR REPLACE FUNCTION public.decrement_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.productos
  SET cantidad = cantidad - NEW.cantidad
  WHERE id = NEW.producto_id AND cantidad >= NEW.cantidad;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER auto_decrement_stock
  AFTER INSERT ON public.detalle_pedido
  FOR EACH ROW EXECUTE FUNCTION public.decrement_stock();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage policies
CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
