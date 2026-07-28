'use client';
import { useState } from 'react';

export default function EventFilter({ onFilter }) {
  const [filters, setFilters] = useState({ category: '' });
  const categories = ['All', 'Drum Circle', 'Workshop', 'Festival'];

  const handleChange = (e) => {
    const value = e.target.value === 'All' ? '' : e.target.value;
    setFilters({ category: value });
    onFilter({ category: value });
  };

  return (
    <div className="glass-card p-4">
      <select
        value={filters.category || 'All'}
        onChange={handleChange}
        className="input-dark"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
}