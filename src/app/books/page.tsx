'use client';
import { getBooksList } from '@/utils/apiFunctions';
import BookList from '@/app/components/bookList';
import Filters from '@/app/components/filters';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'
import { SearchParams, BookType } from '@/utils/types';
import useSWR from 'swr';
import Button from '@/app/components/button';

const serializeParams = (params: SearchParams) =>
  new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => [key, String(value)])
  ).toString();

function BooksContent({ values }: { values: SearchParams }) {
  const router = useRouter();
  const { data } = useSWR(
    ['books', serializeParams(values)],
    () => getBooksList(values),
    { suspense: true }
  );

  const books = data?.results ?? [];
  const pagination = {
    next: data?.next ?? null,
    current: values?.page ? Number(values.page) : 1,
    previous: data?.previous ?? null
  };

  return (
    <>
      <BookList books={books} />
      <div className="flex justify-between mt-4">
        {pagination.previous ? (
          <Button
            onClick={() =>
              router.push(
                `/books?${new URLSearchParams(
                  Object.entries({ ...values, page: String(pagination.current - 1) }).filter(
                    ([, v]) => v !== undefined
                  ) as [string, string][]
                ).toString()}`
              )
            }
          >
            Precedente
          </Button>
        ) : (
          <div />
        )}
        <span className="px-4 py-2 rounded-xl">{pagination.current}</span>
        {pagination.next ? (
          <Button
            onClick={() =>
              router.push(
                `/books?${new URLSearchParams(
                  Object.entries({ ...values, page: String(pagination.current + 1) }).filter(
                    ([, v]) => v !== undefined
                  ) as [string, string][]
                ).toString()}`
              )
            }
          >
            Successivo
          </Button>
        ) : (
          <div />
        )}
      </div>
    </>
  );
}

export default function BooksPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const searchParamsHook = useSearchParams();
  const router = useRouter();
  const [values, setValues] = useState<SearchParams>(() =>
    Object.fromEntries(searchParamsHook.entries()) as SearchParams
  );

  useEffect(() => {
    const params = Object.fromEntries(searchParamsHook.entries()) as SearchParams;
    if (serializeParams(params) !== serializeParams(values)) {
      setValues(params);
    }
  }, [searchParamsHook, values]);

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
        <BooksContent values={values} />
      </Suspense>
    </main>
  );
}
