'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro em um serviço de monitoramento
    console.error('Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-red-100 p-4 mb-6">
        <AlertCircle className="w-12 h-12 text-red-600" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Ops! Algo deu errado</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Ocorreu um erro inesperado na aplicação. Já fomos notificados e estamos trabalhando para resolver.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => reset()}
          className="flex items-center gap-2 bg-[#004587] hover:bg-[#003566]"
        >
          <RefreshCcw className="w-4 h-4" />
          Tentar novamente
        </Button>
        
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2 w-full">
            <Home className="w-4 h-4" />
            Voltar para o Início
          </Button>
        </Link>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12 p-4 bg-gray-100 rounded text-left overflow-auto max-w-2xl w-full border border-gray-200">
          <p className="text-xs font-mono text-red-800 break-words">
            {error.message}
          </p>
          {error.stack && (
            <pre className="text-[10px] mt-2 text-gray-500 font-mono">
              {error.stack}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
