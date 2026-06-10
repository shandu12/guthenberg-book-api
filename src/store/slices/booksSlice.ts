import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BookType } from '@/utils/types';

interface BooksState {
  items: BookType[];
}

const initialState: BooksState = {
  items: [],
};

const booksSlice = createSlice({
// Unimplemented because i expect to use supabase
  name: 'books',
  initialState,
  reducers: {
    setBooks(state, action: PayloadAction<BookType[]>) {
      state.items = action.payload;
    },
  },
});

export const { setBooks } = booksSlice.actions;
export default booksSlice.reducer;
