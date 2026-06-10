'use client';
import { SearchParams } from '@/utils/types';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { fields } from '@/utils/filtersForm';
import Button from '@/app/components/button';

type FiltersProps = {
  searchParams: SearchParams;
  onSubmit?: (params: SearchParams) => void;
};

export default function Filters({ searchParams, onSubmit }: FiltersProps) {
  const [values, setValues] = useState<SearchParams>(searchParams);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setValues(searchParams);
  }, [searchParams]);

  const handleChange = (key: keyof SearchParams) => (event: ChangeEvent<HTMLInputElement>) => {
    const next = { ...values, [key]: event.target.value } as SearchParams;
    setValues(next);
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(values);
  };
  return (
    <>
      <Button
        onClick={() => setShowFilters((prev) => !prev)}
      >
        {showFilters ? 'Nascondi filtri' : 'Mostra filtri'}
      </Button>

      {showFilters && <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.name} className="block mb-2">
            {field.label}
            <input
              name={field.name}
              type={field.type}
              value={String((values as Record<string, unknown>)[field.name] ?? '')}
              onChange={handleChange(field.name as keyof SearchParams)}
              className="mt-1 block w-full px-3 py-2 border rounded-md bg-white shadow-sm focus:outline-none"
              placeholder={`Inserisci ${field.label.toLowerCase()}`}
            />
          </label>
        ))}
        <Button type="submit">Applica</Button>
      </form>}
    </>
  );
}
