'use client'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Facebook, Twitter, Instagram, Sun, Moon, ChevronDown, Home, BookOpen, FileText, BarChart2, ScrollText, LogIn, LogOut, User, X } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import AuthServices from "@/services/authServices";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { login, logout } from "@/lib/store/auth/auth";
import { toggleTheme } from "@/lib/store/theme/theme";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

import Header from "./Header";
import { Footer } from "./Footer";
import MobileDock from "./MobileDock";
import WebDock from "./WebDock";

export default function LayoutClient({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const { mode } = useSelector((state: RootState) => state.theme);
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.className = mode;
      document.documentElement.style.colorScheme = mode;
    }
  }, [mode]);

  const verifyAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      if (isAuth) {
        localStorage.removeItem("token");
        dispatch(logout());
      }
      return;
    }

    try {
      const response = await AuthServices.isAuthenticated(token);
      if (response) {
        dispatch(login({ user: response, token }));
      }
    } catch (e: any) {
      if (e.response?.status === 401 || e.response?.status === 403) {
        localStorage.removeItem("token");
        dispatch(logout());
      }
      console.error("Auth verification failed:", e);
    }
  }

  useEffect(() => {
    setMounted(true);
    verifyAuth();
  }, [])

  const router = useRouter();

  const handleCleanSession = async () => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      try { await AuthServices.logout(token); } catch (e) { }
    }
    localStorage.removeItem("token");
    dispatch(logout());
    router.push("/autenticacao/login");
  }

  const isGerenciador = pathname?.startsWith("/gerenciador");

  return (
    <div className="min-h-screen flex flex-col">
      {!isGerenciador && <Header />}
      <main className={!isGerenciador ? "flex-1" : ""}>
        {children}
      </main>
      {!isGerenciador && <Footer />}
      {!isGerenciador && <MobileDock />}
      {!isGerenciador && <WebDock />}
    </div>
  );
}
