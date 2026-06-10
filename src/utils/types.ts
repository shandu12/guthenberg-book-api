export type AuthorType = {
  id: number;
  name: string;
}

export type SubjectType = {
  name: string;
}

export type BookType = {
  id: number;
  title: string;
  authors: AuthorType[];
  downloadCount: number;
  issued: Date;
  readingEaseScore: number;
  subjects?: SubjectType[];
  //i was planning on implementing an image, but none of the cover image links i tried on the guthenberg api load so i removed it
}

export type User = {
  email: string;
  token?: string;
  expiresAt?: number;
}

export type ReviewData = {
  id?: number;
  user_email: string;
  book_id: number;
  grade?: number;
  text?: string;
}
export type SearchParams = {
  // parameters for guthenberg api, might want to add q for general search?
  page?: number;
  author?: string;
  language?: string;
  minReadingEaseScore?: number;
  minDownloadCount?: number;
  ids?: string;
  title?: string;
  subject?: string;
}

export type BooksApiResponse = {
  next: string | null;
  previous: string | null;
  results: BookType[];
}

// Raw API response types for validation
export type RawBookData = {
  id: number;
  title: string;
  authors: AuthorType[];
  download_count: number;
  issued: Date;
  reading_ease_score: number;
  [key: string]: any;
}

export type RawBooksApiResponse = {
  next: string | null;
  previous: string | null;
  results: RawBookData[];
}

// Review types with proper typing
export type Review = ReviewData & {
  created_at?: string;
  updated_at?: string;
}