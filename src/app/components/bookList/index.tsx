'use client';
import { BookType } from '@/utils/types';
import BookItem from '@/app/components/bookItem';

export default function BookList( { books }: { books: BookType[] }) {
  
  return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {books.map((book) => (
      <BookItem key={book.id} book={book} />
    ))}
  </div>;
}
