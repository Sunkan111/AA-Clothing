import { ChangeEvent } from 'react';

/**
 * Defines the shape of the filter state used across pages. Each property
 * corresponds to a dropdown value in the filter sidebar. A null value
 * means no filter is applied for that property.
 */
export type Filters = {
  /** Selected clothing size (S, M, L, XL) or null for all */
  size: string | null;
  /** Selected fit (slim, regular, loose) or null for all */
  fit: string | null;
  /** Selected category (dam, herr, barn) or null for all */
  category: string | null;
};

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  sort: string;
  onSortChange: (sort: string) => void;
}

/**
 * FilterSidebar renders a vertical sidebar containing dropdowns to filter
 * the product list by size, fit and category as well as a dropdown to
 * sort by price. It is hidden on mobile to maximise available screen
 * space and displayed on medium and larger screens.
 */
export default function FilterSidebar({ filters, onFilterChange, sort, onSortChange }: FilterSidebarProps) {
  const handleSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, size: e.target.value || null });
  };
  const handleFitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, fit: e.target.value || null });
  };
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, category: e.target.value || null });
  };
  const handleSortChangeInternal = (e: ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  return (
    <aside className="w-64 p-4 border-r border-gray-200 hidden md:block">
      <h2 className="font-semibold mb-4">Filter</h2>
      {/* Size filter */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Storlek</label>
        <select
          value={filters.size || ''}
          onChange={handleSizeChange}
          className="w-full border rounded p-2 text-sm"
        >
          <option value="">Alla</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>
      {/* Fit filter */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Passform</label>
        <select
          value={filters.fit || ''}
          onChange={handleFitChange}
          className="w-full border rounded p-2 text-sm"
        >
          <option value="">Alla</option>
          <option value="slim">Slim</option>
          <option value="regular">Regular</option>
          <option value="loose">Loose</option>
        </select>
      </div>
      {/* Category filter */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Kategori</label>
        <select
          value={filters.category || ''}
          onChange={handleCategoryChange}
          className="w-full border rounded p-2 text-sm"
        >
          <option value="">Alla</option>
          <option value="dam">Dam</option>
          <option value="herr">Herr</option>
          <option value="barn">Barn</option>
        </select>
      </div>
      {/* Sort options */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Sortera</label>
        <select
          value={sort}
          onChange={handleSortChangeInternal}
          className="w-full border rounded p-2 text-sm"
        >
          <option value="">Ingen</option>
          <option value="asc">Pris: Lågt till högt</option>
          <option value="desc">Pris: Högt till lågt</option>
        </select>
      </div>
    </aside>
  );
}