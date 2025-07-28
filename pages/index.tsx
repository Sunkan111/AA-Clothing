import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string[];
  fit: string;
  image: string;
  // Additional fields such as color or category can be added as needed
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<{ size: string | null; fit: string | null }>({
    size: null,
    fit: null,
  });
  const [sort, setSort] = useState('');

  useEffect(() => {
    // Load product data from the JSON file in the data directory
    fetch('/data/products.json')
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, []);

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleFilterChange = (newFilters: { size: string | null; fit: string | null }) => {
    setFilters(newFilters);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  // Apply search and filters to products
  const filtered = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesSize = !filters.size || product.size.includes(filters.size);
    const matchesFit = !filters.fit || product.fit === filters.fit;
    return matchesSearch && matchesSize && matchesFit;
  });

  // Sort the filtered products by price
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'asc') return a.price - b.price;
    if (sort === 'desc') return b.price - a.price;
    return 0;
  });

  return (
    <Layout search={search} onSearch={handleSearch}>
      <div className="flex flex-col md:flex-row">
        {/* Sidebar for filters and sorting */}
        <aside className="w-full md:w-1/4 mb-4 md:mb-0 md:mr-4">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            sort={sort}
            onSortChange={handleSortChange}
          />
        </aside>

        {/* Product grid */}
        <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </main>
      </div>
    </Layout>
  );
}
