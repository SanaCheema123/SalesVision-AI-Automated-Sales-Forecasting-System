import { Package, Search, Plus } from 'lucide-react';

const mockProducts = [
  { id: 1, name: 'Smartphone X', category: 'Electronics', price: '$899', stock: 245, status: 'active' },
  { id: 2, name: 'Laptop Pro', category: 'Electronics', price: '$1,299', stock: 89, status: 'active' },
  { id: 3, name: 'Wireless Headphones', category: 'Electronics', price: '$249', stock: 312, status: 'active' },
  { id: 4, name: 'Running Shoes', category: 'Clothing', price: '$129', stock: 156, status: 'active' },
  { id: 5, name: 'Smart Watch', category: 'Electronics', price: '$399', stock: 78, status: 'low_stock' },
  { id: 6, name: 'Yoga Mat', category: 'Home & Living', price: '$49', stock: 0, status: 'out_of_stock' },
];

const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
  active:       { label: 'Active',       color: '#10b981', bg: '#10b98120' },
  low_stock:    { label: 'Low Stock',    color: '#f59e0b', bg: '#f59e0b20' },
  out_of_stock: { label: 'Out of Stock', color: '#ef4444', bg: '#ef444420' },
};

export default function ProductsPage() {
  return (
    <div className="p-6 space-y-6" style={{ background: '#0f1117', minHeight: '100%' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Manage your product catalog</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#1a1d27', border: '1px solid #2a2d3e' }}>
        <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid #2a2d3e' }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
            <input className="w-full pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" style={{ background: '#0f1117', border: '1px solid #2a2d3e', color: '#e2e8f0' }} placeholder="Search products..." />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2d3e' }}>
              {['Product', 'Category', 'Price', 'Stock', 'Status'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold" style={{ color: '#6b7280' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((p, i) => {
              const s = statusStyle[p.status];
              return (
                <tr key={p.id} style={{ borderBottom: i < mockProducts.length - 1 ? '1px solid #2a2d3e' : 'none' }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2a2d3e' }}>
                        <Package size={14} style={{ color: '#7c3aed' }} />
                      </div>
                      <span className="font-medium text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: '#9ca3af' }}>{p.category}</td>
                  <td className="px-6 py-4 font-semibold text-white">{p.price}</td>
                  <td className="px-6 py-4 text-white">{p.stock}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}