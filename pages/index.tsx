import { useState } from 'react';
import productsData from '../data/products.json';
import ProductCard, { Product } from '../components/ProductCard';
import FilterSidebar, { Filters } from '../components/FilterSidebar';

export default function Home() {
  const [filters, setFilters] = useState<Filters>({ size: null, fit: null });
  const [sort, setSort] = useState<'name' | 'price'>('name');

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: 'name' | 'price') => {
    setSort(newSort);
  };

  const filteredProducts = (productsData as Product[])
    .filter((product) => {
      if (filters.size && product.size !== filters.size) return false;
      if (filters.fit && product.fit !== filters.fit) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price') {
        return a.price - b.price;
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <main className="flex">
      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        sort={sort}
        onSortChange={handleSortChange}
      />
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
