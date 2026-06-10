'use client';
import { getBooksList } from '@/utils/apiFunctions';
import BookList from '@/app/components/bookList';
import Filters from '@/app/components/filters';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'
import { SearchParams } from '@/utils/types';
import { useEffect, useState } from 'react';
import { BookType } from '@/utils/types';
import Button from '@/app/components/button';

export default function BooksPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const searchParamsHook = useSearchParams();
  const router = useRouter();
  const [values, setValues] = useState<SearchParams | null>(null);
  const [books, setBooks] = useState([] as BookType[] | []);
  const [pagination, setPagination] = useState({ next: null, current: 1, previous: null } as { next: string | null, current: number, previous: string | null });

  const serializeParams = (params: SearchParams | null) =>
    new URLSearchParams(
      Object.entries(params || {})
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString();

  useEffect(() => {
    const params = Object.fromEntries(searchParamsHook.entries()) as SearchParams;
    if (values === null || serializeParams(params) !== serializeParams(values)) {
      setValues(params);
    }
  }, [searchParamsHook, values]);

  useEffect(() => {
    if (values === null) return;

    const fetchBooks = async () => {
      const data = await getBooksList(values);
      setBooks(data.results);
      setPagination({
        next: data.next,
        current: values.page ? Number(values.page) : 1,
        previous: data.previous
      });
    };
    fetchBooks();
  }, [values]);

  const handleFilterSubmit = (params: SearchParams) => {
    const nextParams = new URLSearchParams(Object.fromEntries(searchParamsHook.entries()));

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });
    nextParams.delete('page');
    router.push(`/books?${nextParams.toString()}`);
  };
  return (
    <main className="container mx-auto py-8">
      <h1>Catalogo Libri</h1>
      {values && <Filters searchParams={values} onSubmit={handleFilterSubmit} />}
      <Suspense fallback={<div>Caricamento...</div>}>
        <BookList books={books} />
        <div className="flex justify-between mt-4">
          {pagination.previous ? (
            <Button
              onClick={() => router.push(`/books?${new URLSearchParams(Object.entries({ ...values, page: String(pagination.current - 1) }).filter(([, v]) => v !== undefined) as [string, string][]).toString()}`)}
            >
              Precedente
            </Button>
          ) : <div />}
          <span className="px-4 py-2 rounded-xl">
            {pagination.current}
          </span>
          {pagination.next ? (
            <Button
              onClick={() => router.push(`/books?${new URLSearchParams(Object.entries({ ...values, page: String(pagination.current + 1) }).filter(([, v]) => v !== undefined) as [string, string][]).toString()}`)}
            >
              Successivo
            </Button>
          ) : <div />}

        </div>
      </Suspense>

    </main>
  );
}
