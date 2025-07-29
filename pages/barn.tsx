import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  size: string[];
  color: string;
  category: string;
  image: string;
  description: string;
  fit: string;
}

/**
 * Page component for the Barn (children's) category.
 * Loads products from the JSON file and filters to show only those
 * belonging to the "barn" category. Supports search, size and fit
 * filters and price sorting using the shared FilterSidebar component.
 */
export default function BarnPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<{ size: string | null; fit: string | null }>({
    size: null,
    fit: null,
  });
  const [sort, setSort] = useState('');

  useEffect(() => {
    import('../data/products.json')
      .then((module) => {
        const data: Product[] = (module as any).default || module;
        setProducts(data);
      })
      .catch((err) => {
        console.error('Failed to load products', err);
      });
  }, []);

  const handleSearch = (query: string) => setSearch(query);
  const handleSortChange = (value: string) => setSort(value);
  const handleFilterChange = (newFilters: { size: string | null; fit: string | null; category?: string | null }) => {
    setFilters({ size: newFilters.size, fit: newFilters.fit });
  };

  const filtered = products.filter((product) => {
    if (product.category !== 'barn') return false;
    if (filters.size && !product.size.includes(filters.size)) return false;
    if (filters.fit && product.fit !== filters.fit) return false;
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sorted = [...filtered];
  if (sort === 'asc') sorted.sort((a, b) => a.price - b.price);
  if (sort === 'desc') sorted.sort((a, b) => b.price - a.price);

  return (
    <Layout search={search} onSearch={handleSearch}>
      <div className="flex">
        <FilterSidebar
          filters={{ ...filters, category: 'barn' }}
          onFilterChange={handleFilterChange}
          sort={sort}
          onSortChange={handleSortChange}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1 p-4">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
}