'use client';

import { SPECIALIZATIONS } from '@/lib/constants';
import type { Province, Specialization } from '@/lib/types';
import ProvinceSelector from './ProvinceSelector';

interface FilterPanelProps {
  selectedProvince: Province | '';
  selectedSpecialization: Specialization | '';
  onProvinceChange: (province: Province | '') => void;
  onSpecializationChange: (spec: Specialization | '') => void;
}

export default function FilterPanel({
  selectedProvince,
  selectedSpecialization,
  onProvinceChange,
  onSpecializationChange,
}: FilterPanelProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <ProvinceSelector selected={selectedProvince} onChange={onProvinceChange} />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
        <select
          value={selectedSpecialization}
          onChange={(e) => onSpecializationChange(e.target.value as Specialization | '')}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">All Specializations</option>
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
