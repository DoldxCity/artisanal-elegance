import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { formatPrice } from "@/types/database";
import type { Producto, Pedido } from "@/types/database";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, LogOut, Package, ShoppingBag, BarChart3, X } from "lucide-react";
import { getProductImage } from "@/lib/images";

type Tab = "productos" | "pedidos" | "estadisticas";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("productos");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

  // Form state
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [precioOriginal, setPrecioOriginal] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [categoria, setCategoria] = useState("");
  const [promocion, setPromocion] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [loading, user, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchProductos();
      fetchPedidos();
    }
  }, [isAdmin]);

  const fetchProductos = async () => {
    const { data } = await supabase.from("productos").select("*").order("created_at", { ascending: false });
    setProductos((data as unknown as Producto[]) ?? []);
  };

  const fetchPedidos = async () => {
    const { data } = await supabase.from("pedidos").select("*").order("created_at", { ascending: false });
    setPedidos((data as unknown as Pedido[]) ?? []);
  };

  const resetForm = () => {
    setNombre(""); setDescripcion(""); setPrecio(""); setPrecioOriginal("");
    setCantidad(""); setCategoria(""); setPromocion(false); setImageFile(null);
    setEditingProduct(null); setShowForm(false);
  };

  const openEdit = (p: Producto) => {
    setEditingProduct(p);
    setNombre(p.nombre);
    setDescripcion(p.descripcion);
    setPrecio(String(p.precio));
    setPrecioOriginal(p.precio_original ? String(p.precio_original) : "");
    setCantidad(String(p.cantidad));
    setCategoria(p.categoria);
    setPromocion(p.promocion);
    setShowForm(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { toast.error("Error subiendo imagen"); return null; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !precio) return;

    let imagen_url = editingProduct?.imagen_url ?? null;
    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (url) imagen_url = url;
    }

    const record = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
      precio_original: precioOriginal ? Number(precioOriginal) : null,
      cantidad: Number(cantidad) || 0,
      categoria: categoria.trim() || "General",
      promocion,
      imagen_url,
    };

    if (editingProduct) {
      const { error } = await supabase.from("productos").update(record).eq("id", editingProduct.id);
      if (error) { toast.error("Error actualizando"); return; }
      toast.success("Producto actualizado");
    } else {
      const { error } = await supabase.from("productos").insert(record);
      if (error) { toast.error("Error creando"); return; }
      toast.success("Producto creado");
    }

    resetForm();
    fetchProductos();
    queryClient.invalidateQueries({ queryKey: ["productos"] });
    queryClient.invalidateQueries({ queryKey: ["categorias"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) { toast.error("Error eliminando"); return; }
    toast.success("Producto eliminado");
    fetchProductos();
    queryClient.invalidateQueries({ queryKey: ["productos"] });
  };

  const totalVentas = pedidos.reduce((s, p) => s + Number(p.total), 0);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-body text-muted-foreground">Cargando...</div>;
  if (!isAdmin) return null;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "productos", label: "Productos", icon: <Package size={16} /> },
    { key: "pedidos", label: "Pedidos", icon: <ShoppingBag size={16} /> },
    { key: "estadisticas", label: "Estadísticas", icon: <BarChart3 size={16} /> },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-display text-lg">ATELIER — Admin</h1>
          <button onClick={signOut} className="flex items-center gap-1 font-body text-xs opacity-70 hover:opacity-100 transition-opacity">
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-4 flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-sm font-body text-xs tracking-wider uppercase transition-colors ${
              tab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* PRODUCTOS TAB */}
        {tab === "productos" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-foreground">Productos ({productos.length})</h2>
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="flex items-center gap-1.5 bg-accent text-accent-foreground px-4 py-2 rounded-sm font-body text-xs tracking-wider uppercase hover:opacity-90 transition-opacity"
              >
                <Plus size={14} /> Nuevo
              </button>
            </div>

            {/* Form Modal */}
            {showForm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-background rounded-sm shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <h3 className="font-display text-lg">{editingProduct ? "Editar Producto" : "Nuevo Producto"}</h3>
                    <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
                  </div>
                  <form onSubmit={handleSave} className="p-6 space-y-4">
                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre *" required className="w-full px-4 py-3 bg-secondary text-foreground placeholder:text-muted-foreground rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                    <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" rows={3} className="w-full px-4 py-3 bg-secondary text-foreground placeholder:text-muted-foreground rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent resize-none" />
                    <div className="grid grid-cols-2 gap-4">
                      <input value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio *" type="number" required className="w-full px-4 py-3 bg-secondary text-foreground placeholder:text-muted-foreground rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                      <input value={precioOriginal} onChange={(e) => setPrecioOriginal(e.target.value)} placeholder="Precio original" type="number" className="w-full px-4 py-3 bg-secondary text-foreground placeholder:text-muted-foreground rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Cantidad" type="number" className="w-full px-4 py-3 bg-secondary text-foreground placeholder:text-muted-foreground rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                      <input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Categoría" className="w-full px-4 py-3 bg-secondary text-foreground placeholder:text-muted-foreground rounded-sm font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent" />
                    </div>
                    <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer">
                      <input type="checkbox" checked={promocion} onChange={(e) => setPromocion(e.target.checked)} className="accent-accent" />
                      En promoción
                    </label>
                    <div>
                      <label className="font-body text-xs text-muted-foreground block mb-1">Imagen del producto</label>
                      <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="font-body text-sm text-foreground" />
                    </div>
                    <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-sm font-body text-sm tracking-wider uppercase hover:opacity-90 transition-opacity">
                      {editingProduct ? "Actualizar" : "Crear Producto"}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-3 px-2 text-xs text-muted-foreground uppercase tracking-wider">Imagen</th>
                    <th className="py-3 px-2 text-xs text-muted-foreground uppercase tracking-wider">Nombre</th>
                    <th className="py-3 px-2 text-xs text-muted-foreground uppercase tracking-wider">Precio</th>
                    <th className="py-3 px-2 text-xs text-muted-foreground uppercase tracking-wider">Stock</th>
                    <th className="py-3 px-2 text-xs text-muted-foreground uppercase tracking-wider">Promo</th>
                    <th className="py-3 px-2 text-xs text-muted-foreground uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-2">
                        <img src={p.imagen_url || getProductImage("product-1")} alt={p.nombre} className="w-10 h-10 object-cover rounded-sm" />
                      </td>
                      <td className="py-3 px-2 text-foreground">{p.nombre}</td>
                      <td className="py-3 px-2 text-accent">{formatPrice(p.precio)}</td>
                      <td className="py-3 px-2">
                        <span className={p.cantidad === 0 ? "text-destructive" : "text-foreground"}>{p.cantidad}</span>
                      </td>
                      <td className="py-3 px-2">
                        {p.promocion && <span className="bg-accent text-accent-foreground text-[10px] px-2 py-0.5 rounded-sm uppercase">Sí</span>}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)} className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(p.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PEDIDOS TAB */}
        {tab === "pedidos" && (
          <div>
            <h2 className="font-display text-xl text-foreground mb-6">Pedidos ({pedidos.length})</h2>
            {pedidos.length === 0 ? (
              <p className="text-muted-foreground font-body text-sm">No hay pedidos aún.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full font-body text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-3 px-2 text-xs text-muted-foreground uppercase tracking-wider">Fecha</th>
                      <th className="py-3 px-2 text-xs text-muted-foreground uppercase tracking-wider">Cliente</th>
                      <th className="py-3 px-2 text-xs text-muted-foreground uppercase tracking-wider">Teléfono</th>
                      <th className="py-3 px-2 text-xs text-muted-foreground uppercase tracking-wider">Total</th>
                      <th className="py-3 px-2 text-xs text-muted-foreground uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((p) => (
                      <tr key={p.id} className="border-b border-border/50">
                        <td className="py-3 px-2 text-muted-foreground">{new Date(p.created_at).toLocaleDateString("es-CO")}</td>
                        <td className="py-3 px-2 text-foreground">{p.cliente_nombre}</td>
                        <td className="py-3 px-2 text-muted-foreground">{p.cliente_telefono || "—"}</td>
                        <td className="py-3 px-2 text-accent">{formatPrice(Number(p.total))}</td>
                        <td className="py-3 px-2">
                          <span className="bg-secondary text-foreground text-[10px] px-2 py-0.5 rounded-sm uppercase">{p.estado}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ESTADÍSTICAS TAB */}
        {tab === "estadisticas" && (
          <div>
            <h2 className="font-display text-xl text-foreground mb-6">Estadísticas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-secondary rounded-sm p-6">
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Productos</p>
                <p className="font-display text-2xl text-foreground">{productos.length}</p>
              </div>
              <div className="bg-secondary rounded-sm p-6">
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Pedidos</p>
                <p className="font-display text-2xl text-foreground">{pedidos.length}</p>
              </div>
              <div className="bg-secondary rounded-sm p-6">
                <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Ventas Totales</p>
                <p className="font-display text-2xl text-accent">{formatPrice(totalVentas)}</p>
              </div>
            </div>
            <div className="bg-secondary rounded-sm p-6">
              <h3 className="font-display text-lg text-foreground mb-4">Productos con bajo stock</h3>
              <div className="space-y-2">
                {productos.filter((p) => p.cantidad <= 5).map((p) => (
                  <div key={p.id} className="flex justify-between items-center font-body text-sm">
                    <span className="text-foreground">{p.nombre}</span>
                    <span className={p.cantidad === 0 ? "text-destructive font-medium" : "text-muted-foreground"}>
                      {p.cantidad === 0 ? "Agotado" : `${p.cantidad} unidades`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
