import { ChangeEvent } from 'react';

export type Filters = {
  size: string | null;
  fit: string | null;
};

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
  const handleSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, size: e.target.value || null });
  };

  const handleFitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, fit: e.target.value || null });
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  return (
    <aside className="w-64 p-4 border-r border-gray-200 hidden md:block">
      <h2 className="font-semibold mb-4">Filter</h2>
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
      <div>
        <label className="block mb-2 text-sm font-medium">Sortera</label>
        <select
          value={sort}
          onChange={handleSortChange}
          className="w-full border rounded p-2 text-sm"
        >
          <option value="name">Namn</option>
          <option value="price">Pris</option>
        </select>
      </div>
    </aside>
  );
}
