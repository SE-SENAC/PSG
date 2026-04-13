import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-blue-100 p-4 mb-6 text-[#004587]">
        <FileQuestion className="w-12 h-12" />
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Página não encontrada</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>

      <Link href="/">
        <Button className="flex items-center gap-2 bg-[#004587] hover:bg-[#003566]">
          <Home className="w-4 h-4" />
          Voltar para o Início
        </Button>
      </Link>
    </div>
  );
}
