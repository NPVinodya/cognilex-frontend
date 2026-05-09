'use client';

import { PROVINCES } from '@/lib/constants';
import type { Province } from '@/lib/types';

interface ProvinceSelectorProps {
  selected: Province | '';
  onChange: (province: Province | '') => void;
}

export default function ProvinceSelector({ selected, onChange }: ProvinceSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Province</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value as Province | '')}
        className="w-full px-3 md:px-4 py-2 border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-amber-500"
      >
        <option value="">All Provinces</option>
        {PROVINCES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
}
