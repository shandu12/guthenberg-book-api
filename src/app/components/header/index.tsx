import Menu from '@/app/components/menu';

export default function Header() {
  return <header className="bg-transparent min-h-[25vh]">
    <div className="bg-gradient-primary text-white py-4 mb-2">
      <h1 className="text-3xl text-shadow-lg font-bold text-center py-4">Libreria Digitale</h1>
      <Menu />
    </div>
  </header>;
}
