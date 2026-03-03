import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Producto } from "@/types/database";

export const useProductos = () => {
  return useQuery({
    queryKey: ["productos"],
    queryFn: async (): Promise<Producto[]> => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as Producto[]) ?? [];
    },
  });
};

export const useCategorias = () => {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from("productos")
        .select("categoria");
      if (error) throw error;
      const cats = [...new Set((data as unknown as { categoria: string }[]).map((d) => d.categoria))];
      return ["Todos", ...cats.sort()];
    },
  });
};
