'use client'
import { BookType } from '@/utils/types';
import { getBookById, getUserReviews, createReview, addBookToUserCatalogue, deleteReview } from '@/utils/apiFunctions';
import { checkIsLogged } from "@/store/store";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import Button from '@/app/components/button';
import { Review } from "@/utils/types"


export default function BookDetailPage() {
  const params = useParams<{ id: string; }>()
  const user = useSelector((state: RootState) => state.user.current)
  const [book, setBook] = useState(null as BookType | null)
  const [isLoggedIn, setIsLoggedIn] = useState(checkIsLogged(user))
  const [reviews, setReviews] = useState<Review[]>([])
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [grade, setGrade] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const userEmail = user?.email ?? ''

  useEffect(() => {
    const fetchBooks = async () => {
      setBook(await getBookById(params.id));
    }
    fetchBooks()
  }, [params.id])

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!isLoggedIn || !userEmail) return
      try {
        const userReviewsData = await getUserReviews(userEmail)
        setReviews(userReviewsData)

        const bookReview = userReviewsData.find((review: Review) => review.book_id === parseInt(params.id))
        if (bookReview) {
          setUserReview(bookReview)
          setGrade(bookReview.grade || 5)
          setReviewText(bookReview.text || '')
        }
      } catch (error) {
        console.error('Failed to fetch user reviews:', error)
      }
    }

    fetchUserReviews()
  }, [isLoggedIn, userEmail, params.id])

  useEffect(() => {
    setIsLoggedIn(checkIsLogged(user))
  }, [user])

  const handleAddToList = async () => {
    try {
      setIsSubmitting(true)
      setSubmitError('')
      await addBookToUserCatalogue(userEmail, parseInt(params.id))

      const updatedReviews = await getUserReviews(userEmail)
      setReviews(updatedReviews)
      const bookReview = updatedReviews.find((review: Review) => review.book_id === parseInt(params.id))
      if (bookReview) {
        setUserReview(bookReview)
      }

      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Impossibile aggiungere il libro')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      setSubmitError('')

      if (grade < 1 || grade > 10) {
        setSubmitError('La valutazione deve essere compresa tra 1 e 10')
        return
      }

      await createReview(userEmail, parseInt(params.id), grade, reviewText)
      setSubmitSuccess(true)
      const updatedReviews = await getUserReviews(userEmail)
      setReviews(updatedReviews)
      const bookReview = updatedReviews.find((review: Review) => review.book_id === parseInt(params.id))
      if (bookReview) {
        setUserReview(bookReview)
      }

      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Impossibile inviare la recensione')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReview = async () => {
    try {
      setIsSubmitting(true)
      setSubmitError('')
      await deleteReview(userEmail, parseInt(params.id))

      setUserReview(null)
      setGrade(5)
      setReviewText('')

      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Impossibile eliminare la recensione')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!book) {
    return (
      <main>
        <h1>Libro non trovato</h1>
        <p>Non è stato possibile trovare un libro con l'id fornito.</p>
      </main>
    );
  }


  return (
    <main className='container'>
      <article>
        <h1>{book.title}</h1>
        <p>
          <strong>Autore:</strong> {book.authors[0].name}
        </p>
        <p>
          <strong>Download:</strong> {book.downloadCount} <br />
          <strong>Anno di pubblicazione:</strong> {book.issued?.toString().slice(0, 4)} <br />
        </p>
        {isLoggedIn && !userReview && (
          <Button onClick={handleAddToList} >
            {isSubmitting ? 'Aggiungendo...' : 'Aggiungi alla lista'}
          </Button>
        )}
        {isLoggedIn && userReview && (
          <Button onClick={handleDeleteReview} >
            {isSubmitting ? 'Rimuovendo...' : 'Rimuovi dalla lista'}
          </Button>
        )}


        {submitSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            Operazione completata con successo.
          </div>
        )}

        {submitError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {submitError}
          </div>
        )}

        {isLoggedIn && (
          <section className='mt-8'>
            <h2>{userReview ? 'Modifica la tua recensione' : 'Scrivi una recensione'}</h2>
            <form onSubmit={handleSubmitReview} className='mt-4 space-y-4 max-w-md'>
              <div>
                <label htmlFor='rating' className='block text-sm font-medium'>
                  Voto: {grade}/10
                </label>
                <input
                  id='grade'
                  type='range'
                  min='1'
                  max='10'
                  value={grade}
                  onChange={(e) => setGrade(parseInt(e.target.value))}
                  className='w-full mt-2'
                />
                <div className='flex justify-between text-xs text-gray-600 mt-1'>
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label htmlFor='text' className='block text-sm font-medium'>
                  Testo della recensione
                </label>
                <textarea
                  id='text'
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder='Condividi le tue impressioni su questo libro...'
                  className='w-full mt-2 px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-white'
                  rows={5}
                />
              </div>

              <Button type='submit'>
                {isSubmitting ? (userReview ? 'Aggiornamento...' : 'Invio...') : (userReview ? 'Aggiorna recensione' : 'Invia recensione')}
              </Button>
            </form>
          </section>
        )}
      </article>
    </main>
  );
}
