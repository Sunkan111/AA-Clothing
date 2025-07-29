import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';

// Define the product interface matching the products.json schema
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
 * Page component for the Dam (women's) category.
 * This page loads all products from the JSON data file and filters them
 * to show only those whose category is "dam". Users can further filter
 * by size, fit and search keyword, and sort by price ascending or
 * descending. The layout integrates the existing Layout and
 * FilterSidebar components for a consistent look and feel.
 */
export default function DamPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<{ size: string | null; fit: string | null }>({
    size: null,
    fit: null,
  });
  const [sort, setSort] = useState('');

  // Load product data via dynamic import to avoid fetch on client
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

  // Apply filters specific to the dam category
  const filtered = products.filter((product) => {
    if (product.category !== 'dam') return false;
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
        {/* Sidebar for filters and sorting */}
        <FilterSidebar
          filters={{ ...filters, category: 'dam' }}
          onFilterChange={handleFilterChange}
          sort={sort}
          onSortChange={handleSortChange}
        />
        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1 p-4">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Layout>
  );
}