"use client";

import { BookType } from '@/utils/types';
import { useRouter } from 'next/navigation';

export default function BookItem({ book }: { book: BookType }) {
  const router = useRouter();

  const handleClick = () => {
    if (!book?.id) return;
    router.push(`/books/${book.id}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className="w-80 p-4 m-2 rounded-xl shadow-md flex flex-col items-center bg-gradient-primary hover:cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
    >
      <h2>{book.title}</h2>
      <p>{book.authors?.map((author) => author.name).join(', ')}</p>
      <p>Data: {book.issued?.toString().slice(0, 4)}</p>
      <p>Argomenti: {book.subjects?.join(', ')}</p>
      <p>Leggibilità: {book.readingEaseScore}</p>
      <p>Download: {book.downloadCount}</p>
    </div>
  );
}
