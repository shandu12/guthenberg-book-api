import type { BookType, SearchParams, BooksApiResponse, RawBooksApiResponse, RawBookData, Review } from './types';
import { getFirstElement } from './validation';
import { createClient } from '@supabase/supabase-js';

const NEXT_PUBLIC_BOOKS_API_URL = process.env.NEXT_PUBLIC_BOOKS_API_URL;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
}

const headers: HeadersInit = {
    'Content-Type': 'application/json',
};

if (process.env.NEXT_PUBLIC_RAPIDAPI_HOST) {
    headers['x-rapidapi-host'] = process.env.NEXT_PUBLIC_RAPIDAPI_HOST;
}
if (process.env.NEXT_PUBLIC_RAPIDAPI_KEY) {
    headers['x-rapidapi-key'] = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
}


// const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Transform raw API book data to BookType
 */
function transformBookData(bookData: RawBookData): BookType {
    return {
        id: bookData.id,
        title: bookData.title,
        authors: bookData.authors,
        downloadCount: bookData.download_count,
        issued: bookData.issued,
        readingEaseScore: bookData.reading_ease_score,
        subjects: bookData.subjects,
    };
}

function buildQueryParams(filters: SearchParams): string {
    const params = new URLSearchParams();
    const queryKeyMap: Record<string, string> = {
        minReadingEaseScore: 'reading_ease_min',
        minDownloadCount: 'min_download_count',
        year: 'year_start',
    };

    Object.entries(filters).forEach(([key, value]) => {
        const queryKey = queryKeyMap[key] ?? key;
        if (value !== undefined && value !== null && value !== '') {
            params.append(queryKey, String(value));
        }
    });

    return params.toString();
}

// function to get books list, the filters are defined elsewhere and so is the api endpoint.
export async function getBooksList(filters: SearchParams = {}): Promise<BooksApiResponse> {
    if (!NEXT_PUBLIC_BOOKS_API_URL) {
        throw new Error('NEXT_PUBLIC_BOOKS_API_URL environment variable is not defined');
    }
    const queryString = buildQueryParams(filters);
    console.log(queryString)
    const url = queryString ? `${NEXT_PUBLIC_BOOKS_API_URL}?${queryString}` : NEXT_PUBLIC_BOOKS_API_URL;

    const response = await fetch(url, {
        method: 'GET',
        headers,
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch books list: ${response.status} ${response.statusText}`);
    }

    const data: RawBooksApiResponse = await response.json();

    if (!Array.isArray(data.results)) {
        throw new Error('Invalid API response: results is not an array');
    }


    return {
        next: data.next,
        previous: data.previous,
        results: data.results.map(transformBookData),
    };
}

// get single book for detail page
export async function getBookById(id: string): Promise<BookType> {
    if (!NEXT_PUBLIC_BOOKS_API_URL) {
        throw new Error('NEXT_PUBLIC_BOOKS_API_URL environment variable is not defined');
    }
    const response = await fetch(`${NEXT_PUBLIC_BOOKS_API_URL}/${id}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch book by ID: ${response.status} ${response.statusText}`);
    }

    const data: RawBooksApiResponse = await response.json();

    if (!Array.isArray(data.results) || data.results.length === 0) {
        throw new Error(`Book with ID ${id} not found`);
    }

    const bookData = getFirstElement<RawBookData>(data.results);
    if (!bookData) {
        throw new Error(`Book with ID ${id} not found`);
    }

    return transformBookData(bookData);
}

export async function getBooksByIds(ids: number[]): Promise<BookType[]> {
    if (!NEXT_PUBLIC_BOOKS_API_URL) {
        throw new Error('NEXT_PUBLIC_BOOKS_API_URL environment variable is not defined');
    }

    if (!Array.isArray(ids) || ids.length === 0) {
        return [];
    }

    const queryString = buildQueryParams({ id: ids.join(',') } as any);
    const url = `${NEXT_PUBLIC_BOOKS_API_URL}?${queryString}`;
    const response = await fetch(url, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch books by IDs: ${response.status} ${response.statusText}`);
    }

    const data: RawBooksApiResponse = await response.json();

    if (!Array.isArray(data.results)) {
        throw new Error('Invalid API response: results is not an array');
    }

    return data.results.map(transformBookData);
}

export async function addBookToUserCatalogue(userEmail: string, bookId: number): Promise<void> {
    try {
        // Create an entry in the review table with the user ID and book ID
        const { data, error } = await supabaseAdmin
            .from('review')
            .insert([
                {
                    user_email: userEmail,
                    book_id: bookId,
                }
            ]);

        if (error) {
            throw new Error(`Failed to add book to user catalogue: ${error.message}`);
        }

        console.log(`Successfully added book with ID ${bookId} to user ${userEmail}'s catalogue.`);
    } catch (error) {
        console.error('addBookToUserCatalogue error:', error);
        throw error;
    }
}

export async function getCatalogue(userEmail: string): Promise<number[]> {
    try {
        const { data, error } = await supabaseAdmin
            .from('review')
            .select('book_id')
            .eq('user_email', userEmail);

        if (error) {
            throw new Error(`Failed to fetch user catalogue: ${error.message}`);
        }

        if (!Array.isArray(data)) {
            return [];
        }

        return data
            .map((item: any) => {
                const bookId = item?.book_id;
                return typeof bookId === 'number' ? bookId : null;
            })
            .filter((id: number | null): id is number => id !== null);
    } catch (error) {
        console.error('getCatalogue error:', error);
        throw error;
    }
}

/**
 * Validates user credentials against Supabase authentication
 * @param email - User email address
 * @param password - User password
 * @returns true if credentials are valid, false otherwise
 */
export async function validateCredentials(
    email: string,
    password: string
): Promise<boolean> {
    try {
        if (!supabaseAdmin) {
            console.error('Supabase admin client not initialized. Missing SUPABASE_SERVICE_ROLE_KEY');
            return false;
        }

        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Authentication error:', error.message);
            return false;
        }

        if (data?.user) {
            console.log('User authenticated:', data.user.email);
            return true;
        }

        return false;
    } catch (error) {
        console.error('validateCredentials error:', error);
        return false;
    }
}

/**
 * Gets all reviews for a specific user
 * @param userEmail - User email address
 * @returns Array of reviews
 */
export async function getUserReviews(userEmail: string): Promise<Review[]> {
    try {
        const { data, error } = await supabaseAdmin
            .from('review')
            .select('*')
            .eq('user_email', userEmail);

        if (error) {
            throw new Error(`Failed to fetch user reviews: ${error.message}`);
        }

        if (!Array.isArray(data)) {
            return [];
        }

        return data.map((item: any) => ({
            id: item?.id,
            user_email: item?.user_email,
            book_id: item?.book_id,
            grade: item?.grade,
            text: item?.text,
            created_at: item?.created_at,
            updated_at: item?.updated_at,
        }));
    } catch (error) {
        console.error('getUserReviews error:', error);
        throw error;
    }
}

/**
 * Creates or updates a review for a user
 * @param userEmail - User email address
 * @param bookId - Book ID to review
 * @param grade - Grade (1-10)
 * @param text - Review text content
 * @returns The created or updated review object
 */
export async function createReview(
    userEmail: string,
    bookId: number,
    grade: number,
    text: string
): Promise<Review | null> {
    try {
        if (grade < 1 || grade > 10) {
            throw new Error('Rating must be between 1 and 10');
        }

        const { data: existingReview, error: fetchError } = await supabaseAdmin
            .from('review')
            .select('id')
            .eq('user_email', userEmail)
            .eq('book_id', bookId)
            .single();

        // .single() returns an error if no rows found - this is expected behavior
        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
        }

        if (existingReview) {
            const { data, error } = await supabaseAdmin
                .from('review')
                .update({
                    grade: grade,
                    text: text,
                })
                .eq('user_email', userEmail)
                .eq('book_id', bookId)
                .select();

            if (error) {
                throw new Error(`Failed to update review: ${error.message}`);
            }

            if (!Array.isArray(data) || data.length === 0) {
                return null;
            }

            const result = data[0];
            return {
                id: result?.id,
                user_email: result?.user_email,
                book_id: result?.book_id,
                grade: result?.grade,
                text: result?.text,
                created_at: result?.created_at,
                updated_at: result?.updated_at,
            };
        } else {
            const { data, error } = await supabaseAdmin
                .from('review')
                .insert([
                    {
                        user_email: userEmail,
                        book_id: bookId,
                        grade: grade,
                        text: text,
                    }
                ])
                .select();

            if (error) {
                throw new Error(`Failed to create review: ${error.message}`);
            }

            if (!Array.isArray(data) || data.length === 0) {
                return null;
            }

            const result = data[0];
            return {
                id: result?.id,
                user_email: result?.user_email,
                book_id: result?.book_id,
                grade: result?.grade,
                text: result?.text,
                created_at: result?.created_at,
                updated_at: result?.updated_at,
            };
        }
    } catch (error) {
        console.error('createReview error:', error);
        throw error;
    }
}

/**
 * Removes a review from the database
 * @param userEmail - User email address
 * @param bookId - Book ID to remove review for
 * @returns true if successfully deleted, false otherwise
 */
export async function deleteReview(
    userEmail: string,
    bookId: number
): Promise<boolean> {
    try {
        const { error } = await supabaseAdmin
            .from('review')
            .delete()
            .eq('user_email', userEmail)
            .eq('book_id', bookId);

        if (error) {
            throw new Error(`Failed to delete review: ${error.message}`);
        }

        console.log(`Successfully deleted review for book ${bookId} by ${userEmail}`);
        return true;
    } catch (error) {
        console.error('deleteReview error:', error);
        throw error;
    }
}
