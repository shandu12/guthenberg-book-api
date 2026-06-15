'use client';
import { useRouter } from 'next/navigation';
import { checkIsLogged } from "@/store/store";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useEffect, useState } from 'react';
import { getCatalogue, getBooksList } from '@/utils/apiFunctions';
import { BookType } from '@/utils/types';
import BookList from '@/app/components/bookList';
import Button from '@/app/components/button';
export default function UserPage() {
  const router = useRouter();
  const userState = useSelector((state: RootState) => state.user.current);
  const isLoggedIn = checkIsLogged(userState);
  const [books, setBooks] = useState<BookType[]>([]);
  const [pagination, setPagination] = useState({ next: null, current: 1, previous: null } as { next: string | null, current: number, previous: string | null });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/user/login');
    }

    async function loadBooks() {
      try {
        const catalogue = await getCatalogue(userState?.email ?? '');
        if (catalogue.length === 0) {
          setBooks([]);
          setIsLoading(false);
          return;
        }
        const booksData = await getBooksList({ ids: catalogue.join(','), page: pagination.current, });
        setBooks(Array.isArray(booksData.results) ? booksData.results : []);
        setPagination({
          next: booksData.next,
          current: pagination.current,
          previous: booksData.previous
        });
      } catch (error) {
        console.error('Failed to load catalogue', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadBooks();
  }, [isLoggedIn, router,pagination.current]);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">La mia libreria</h1>
      <p className="text-gray-600">Benvenuti</p>
      {isLoggedIn && (
        <div className="mt-6">
          {books.length > 0 && isLoading === false ? (
            <>
              <BookList books={books} />

              <div className="flex justify-between mt-4">
                {pagination.previous ? (
                  <Button
                    onClick={() => setPagination((prev) => ({ ...prev, current: prev.current - 1 }))}
                  >
                    Precedente
                  </Button>
                ) : <div />}
                <span className="px-4 py-2 rounded-xl">
                  {pagination.current}
                </span>
                {pagination.next ? (
                  <Button
                    onClick={() => setPagination((prev) => ({ ...prev, current: prev.current + 1 }))}
                  >
                    Successivo
                  </Button>
                ) : <div />}
              </div>
            </>

          ) :  isLoading === false ? (
            <p className="text-gray-600 mt-4">No books found.</p>
          ) : (
            <p className="text-gray-600 mt-4">Loading books...</p>
          )}
        </div>
      )}
    </main>
  );
}
