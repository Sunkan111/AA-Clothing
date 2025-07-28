import { ChangeEvent } from 'react';

/**
 * Filters interface describing the currently selected filter values.
 * All values are optional and when set to null indicate no filter for that
 * property. Adding new filter keys here means they must also be handled
 * in the calling component (e.g. pages/index.tsx).
 */
export type Filters = {
  /** Selected clothing size (S, M, L) or null for all */
  size: string | null;
  /** Selected fit (slim, regular, loose) or null for all */
  fit: string | null;
  /** Selected category (e.g. tshirt, jeans) or null for all */
  category: string | null;
};

/**
 * FilterSidebar renders a sidebar with dropdowns to filter the product list by
 * size, fit and category as well as a dropdown to sort by price. It is
 * displayed on medium and larger screens and hidden on mobile to preserve
 * screen real estate.
 */
export default function FilterSidebar({
  filters,
  onFilterChange,
  sort,
  onSortChange,
}: {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  sort: string;
  onSortChange: (sort: string) => void;
}) {
  // Update the size filter when the user selects a new size
  const handleSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, size: e.target.value || null });
  };

  // Update the fit filter when the user selects a new fit
  const handleFitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, fit: e.target.value || null });
  };

  // Update the category filter when the user selects a new category
  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, category: e.target.value || null });
  };

  // Pass sort changes back to the parent component
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
          <option value="tshirt">T‑shirts</option>
          <option value="jeans">Jeans</option>
        </select>
      </div>
      {/* Sort options */}
      <div>
        <label className="block mb-2 text-sm font-medium">Sortera</label>
        <select
          value={sort}
          onChange={handleSortChangeInternal}
          className="w-full border rounded p-2 text-sm"
        >
          <option value="">Standard</option>
          <option value="asc">Pris: Lågt till högt</option>
          <option value="desc">Pris: Högt till lågt</option>
        </select>
      </div>
    </aside>
  );
}