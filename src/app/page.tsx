import Link from 'next/link';
import Button from '@/app/components/button';
import Filters from '@/app/components/filters';

export default function HomePage() {
  return (
    <main>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4">Benvenuto alla Libreria Digitale</h1>
        <p className="text-lg mb-6">Esplora il nostro catalogo di libri digitali e gestisci la tua libreria personale.</p>
        <div className="flex space-x-4 mb-6">
          <Link href="/books">
            <Button>Esplora Catalogo</Button>
          </Link>
          <Link href="/user">
            <Button>La mia Libreria</Button>
          </Link>
        </div>
        <Filters searchParams={{}} />
      </div>
    </main>
  );
}
