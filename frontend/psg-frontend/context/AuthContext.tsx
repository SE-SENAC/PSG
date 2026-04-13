'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AuthServices from '@/services/authServices';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const verifyAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const isValid = await AuthServices.isAuthenticated(token);
        setIsAuth(isValid);
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuth(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuth(true);
    router.push('/');
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) await AuthServices.logout(token);
    } finally {
      localStorage.removeItem('token');
      setIsAuth(false);
      router.push('/autenticacao/login');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};