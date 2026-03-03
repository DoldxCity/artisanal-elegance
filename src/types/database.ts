export type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_original: number | null;
  cantidad: number;
  categoria: string;
  imagen_url: string | null;
  promocion: boolean;
  porcentaje_descuento: number;
  created_at: string;
  updated_at: string;
};

export type Pedido = {
  id: string;
  cliente_nombre: string;
  cliente_telefono: string | null;
  total: number;
  estado: string;
  created_at: string;
};

export type DetallePedido = {
  id: string;
  pedido_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
};

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
